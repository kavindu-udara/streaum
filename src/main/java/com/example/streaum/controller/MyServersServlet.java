package com.example.streaum.controller;

import com.example.streaum.DTO.ServerDTO;
import com.example.streaum.entity.*;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.JwtUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.ChannelService;
import com.example.streaum.services.ServerService;
import com.example.streaum.services.UserHasServersService;
import com.example.streaum.services.UserService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.hibernate.Session;

import java.io.IOException;
import java.util.List;

@WebServlet(name = "MyServersServlet", urlPatterns = {"/my-servers", "/my-servers/*"})
public class MyServersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resObj = new JsonObject();
        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            String serverId = request.getPathInfo();
            if (serverId == null || serverId.equals("/") || serverId.isEmpty()) {
                resObj.addProperty("message", "Server id is required.");
                return;
            }

            serverId = serverId.substring(1);

//            find server by id
            ServerService serverService = new ServerService(session);
            Server foundServer = serverService.findServerById(serverId);
            if (foundServer == null) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "Server not found.");
                return;
            }

//            check user is a member of the server
            HttpSession reqSession = request.getSession(false);
            User selectedUser = (User) reqSession.getAttribute("user");

            if (selectedUser == null) {
                resObj.addProperty("message", "User not found.");
                return;
            }

            UserHasServersService userHasServersService = new UserHasServersService(session);
            UserHasServers foundUserHasServers = userHasServersService.findUserHasServersByUserAndServer(selectedUser, foundServer);

            if (foundUserHasServers == null) {
                resObj.addProperty("message", "User is not a member of this server.");
                return;
            }

//            find channels
            ChannelService channelService = new ChannelService(session);
            List<Channel> foundTextChannelList = channelService.findAllChannelsByNameServerAndType(foundServer, ChannelType.TEXT);
            List<Channel> foundVoiceChannelList = channelService.findAllChannelsByNameServerAndType(foundServer, ChannelType.VOICE);

            if (!foundTextChannelList.isEmpty()) {
                resObj.add("textChannels", gson.toJsonTree(foundTextChannelList) );
            }

            if (!foundVoiceChannelList.isEmpty()) {
                resObj.add("voiceChannels", gson.toJsonTree(foundVoiceChannelList) );
            }

            isSuccess = true;
            resStatus = HttpServletResponse.SC_OK;
            resObj.addProperty("message", "Server found successfully.");
            resObj.add("server", gson.toJsonTree(foundServer));
            resObj.addProperty("memberType", foundUserHasServers.getType().toString());

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {

            HttpSession reqSession = request.getSession(false);
            User selectedUser = (User) reqSession.getAttribute("user");

//            find servers list with user
            UserHasServersService userHasServersService = new UserHasServersService(session);
            List<UserHasServers> entities = userHasServersService.findAllUserHasServersByUser(selectedUser);

            if (entities == null || entities.isEmpty()) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "No servers found.");
                return;
            }

            List<ServerDTO> servers = entities.stream()
                    .map(ServerDTO::new)
                    .toList();


            isSuccess = true;
            resStatus = HttpServletResponse.SC_OK;
            resObj.addProperty("message", "Servers found successfully.");
            resObj.add("servers", gson.toJsonTree(servers));

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }

    }
}
