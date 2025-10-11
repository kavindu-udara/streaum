package com.example.streaum.controller;

import com.example.streaum.DTO.MessageSender;
import com.example.streaum.DTO.TextChannelMessageDTO;
import com.example.streaum.entity.*;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.ChannelService;
import com.example.streaum.services.ServerService;
import com.example.streaum.services.TextChannelHistoryService;
import com.example.streaum.services.UserHasServersService;
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
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "TextChannelHistoryServlet", urlPatterns = {"/text-channel-history"})
public class TextChannelHistoryServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            HttpSession reqSession = request.getSession(false);
            User selectedUser = (User) reqSession.getAttribute("user");

            String channelId = request.getParameter("channelId");

            if (channelId == null) {
                resObj.addProperty("message", "Channel ID is required.");
                return;
            }

            if (!channelId.matches("^[0-9]+$")) {
                resObj.addProperty("message", "Channel ID must be a number.");
                return;
            }

//            find channel by id
            ChannelService channelService = new ChannelService(session);
            Channel foundChannel = channelService.findChannelById(channelId);
            if (foundChannel == null) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "Channel not found.");
                return;
            }

//            find server
            ServerService serverService = new ServerService(session);
            Server foundServer = serverService.findServerById(foundChannel.getServer().getId());
            if (foundServer == null) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "Server not found.");
            }

//            check user is on the server
            UserHasServersService userHasServersService = new UserHasServersService(session);
            UserHasServers foundUserHasServers = userHasServersService.findUserHasServersByUserAndServer(selectedUser, foundServer);
            if (foundUserHasServers == null) {
                resObj.addProperty("message", "User is not a member of this server.");
                return;
            }

//            get chat history
            TextChannelHistoryService textChannelHistoryService = new TextChannelHistoryService(session);
            List<TextChannelHistory> textChannelHistoryList = textChannelHistoryService.findAllHistoyByChannel(foundChannel);
            if (textChannelHistoryList.isEmpty()) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "No chat history found.");
                return;
            }

            List<TextChannelMessageDTO> textChannelMessageDTOS = new ArrayList<>();
            for (TextChannelHistory textChannelHistory : textChannelHistoryList) {
                String sender = "me";
                if (textChannelHistory.getUser().getId() != selectedUser.getId()) {
                    sender = "other";
                }
                TextChannelMessageDTO channelHistoryDTO = new TextChannelMessageDTO(String.valueOf(selectedUser.getId()), textChannelHistory.getText(), selectedUser.getFirstName() + " " + selectedUser.getLastName(), textChannelHistory.getCreatedAt().toString(), selectedUser.getToken(), sender);
                textChannelMessageDTOS.add(channelHistoryDTO);
            }

            resStatus = HttpServletResponse.SC_OK;
            isSuccess = true;
            resObj.addProperty("message", "Chat history found successfully.");
            resObj.add("history", gson.toJsonTree(textChannelMessageDTOS));

            resObj.addProperty("channelId", foundChannel.getId());
            resObj.addProperty("serverId", foundServer.getId());
            resObj.addProperty("memberType", foundUserHasServers.getType().toString());

        } catch (Exception e) {
//            throw new RuntimeException(e);
            resObj.addProperty("message", e.getMessage());
        } finally {
            session.close();
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }
}
