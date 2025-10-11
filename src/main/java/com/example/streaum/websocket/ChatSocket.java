package com.example.streaum.websocket;

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

@ServerEndpoint("/chat/{serverId}/{channelId}/{userId}")
public class ChatSocket {

    // Keep track of sessions per channel
    private static final Map<String, Set<Session>> channelSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("serverId") String serverId,
                       @PathParam("channelId") String channelId,
                       @PathParam("userId") String userId) {
        String key = serverId + ":" + channelId;
        channelSessions.putIfAbsent(key, ConcurrentHashMap.newKeySet());
        channelSessions.get(key).add(session);

        System.out.println("User " + userId + " connected to channel " + key);
        broadcast(key, "🟢 User " + userId + " joined the chat");
    }

    @OnMessage
    public void onMessage(Session session,
                          @PathParam("serverId") String serverId,
                          @PathParam("channelId") String channelId,
                          @PathParam("userId") String userId,
                          String message) {
        String key = serverId + ":" + channelId;
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