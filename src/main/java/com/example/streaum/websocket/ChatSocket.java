package com.example.streaum.websocket;

import com.example.streaum.entity.*;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.JwtUtil;
import com.example.streaum.services.ChannelService;
import com.example.streaum.services.ServerService;
import com.example.streaum.services.UserHasServersService;
import com.example.streaum.services.UserService;
import jakarta.websocket.OnOpen;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnError;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@ServerEndpoint("/chat/{serverId}/{channelId}/{token}")
public class ChatSocket {

    // Keep track of sessions per channel
    private static final Map<String, Set<Session>> channelSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("serverId") String serverId,
                       @PathParam("channelId") String channelId,
                       @PathParam("token") String token) {
        String key = serverId + ":" + channelId;
        channelSessions.putIfAbsent(key, ConcurrentHashMap.newKeySet());
        channelSessions.get(key).add(session);

//        check token
        if (JwtUtil.verifyToken(token) == null) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }


        org.hibernate.Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        UserService userService = new UserService(hibernateSession);
        User foundUser = userService.findUserByToken(token);
        if (foundUser == null) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

//        find server by id
        ServerService serverService = new ServerService(hibernateSession);
        Server foundServer = serverService.findServerById(serverId);
        if (foundServer == null) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

//        find user is a member of the server
        UserHasServersService userHasServersService = new UserHasServersService(hibernateSession);
        UserHasServers foundUserHasServer = userHasServersService.findUserHasServersByUserAndServer(foundUser, foundServer);

        if (foundUserHasServer == null) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

//        find the channel is available
        ChannelService channelService = new ChannelService(hibernateSession);
        Channel foundChannel = channelService.findChannelsByNameServer(foundServer);

        if (foundChannel == null) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

//        check channel type
        if(foundChannel.getType() != ChannelType.TEXT){
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        session.getUserProperties().put("userId", foundUser.getId());
        session.getUserProperties().put("firstName", foundUser.getFirstName());
        session.getUserProperties().put("lastName", foundUser.getLastName());
        session.getUserProperties().put("token", foundUser.getToken());
        hibernateSession.close();

//        check user token
        String userId = session.getUserProperties().get("userId").toString();

        System.out.println("User " + userId + " connected to channel " + key);
        broadcast(key, "User " + foundUser.getFirstName() + " joined the chat");
    }

    @OnMessage
    public void onMessage(Session session,
                          @PathParam("serverId") String serverId,
                          @PathParam("channelId") String channelId,
                          @PathParam("token") String token,
                          String message) {
        String key = serverId + ":" + channelId;

        String userId = session.getUserProperties().get("userId").toString();

        if (message.isEmpty()) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

//        db func
        org.hibernate.Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        ChannelService channelService = new ChannelService(hibernateSession);
        Channel foundChannel = channelService.findChannelById(channelId);

        if(foundChannel == null){
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

        if(foundChannel.getType() != ChannelType.TEXT){
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

        UserService userService = new UserService(hibernateSession);
        User foundUser = userService.findUserByToken(token);

        TextChannelHistory textChannelHistory = new TextChannelHistory(foundChannel, message, foundUser);
        hibernateSession.beginTransaction();
        hibernateSession.persist(textChannelHistory);
        hibernateSession.getTransaction().commit();
        hibernateSession.close();

        String formattedMessage = userId + ": " + message;
        broadcast(key, formattedMessage);
    }

    @OnClose
    public void onClose(Session session,
                        @PathParam("serverId") String serverId,
                        @PathParam("channelId") String channelId,
                        @PathParam("userId") String userId) {
        String key = serverId + ":" + channelId;

        Set<Session> sessions = channelSessions.get(key);

        if (sessions != null) {
            sessions.remove(session);
            broadcast(key, "🔴 User " + userId + " left the chat");
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("Error in WebSocket: " + throwable.getMessage());
    }

    private void broadcast(String key, String message) {
        Set<Session> sessions = channelSessions.get(key);
        if (sessions != null) {
            for (Session s : sessions) {
                try {
                    s.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}