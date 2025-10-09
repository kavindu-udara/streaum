package com.example.streaum.controller;

import com.example.streaum.entity.Channel;
import com.example.streaum.entity.ChannelType;
import com.example.streaum.entity.Server;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.ChannelService;
import com.example.streaum.services.ServerService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;

@WebServlet(name = "ChannelServlet", urlPatterns = {"/channels"})
public class ChannelServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {

            String name = reqObj.get("name").getAsString();
            String serverId = reqObj.get("serverId").getAsString();
            String type = reqObj.get("type").getAsString();

            if (name.isEmpty() || serverId.isEmpty() || type.isEmpty()) {
                resObj.addProperty("message", "Name, server ID and type are required.");
            } else if (name.length() > 45) {
                resObj.addProperty("message", "First name, last name and email must be less than 45 characters.");
            } else if (!type.equals("text") && !type.equals("voice")) {
                resObj.addProperty("message", "Type must be either text or voice.");
            } else {

//                find server by id
                ServerService serverService = new ServerService(session);
                Server foundServer = serverService.findServerById(serverId);
                if (foundServer == null) {
                    resObj.addProperty("message", "Server not found.");
                    return;
                }

                ChannelType channelType = ChannelType.TEXT;
                if(type.equals("voice")){
                    channelType = ChannelType.VOICE;
                }

//                find channel already exists
                ChannelService channelService = new ChannelService(session);
                Channel foundChannel = channelService.findChannelByNameServerAndType(foundServer, name, channelType);

                if (foundChannel != null) {
                    resObj.addProperty("message", "Channel already exists.");
                    return;
                }

//                create new channel
                Channel newChannel = new Channel(name, foundServer, channelType);
                session.beginTransaction();
                session.persist(newChannel);
                session.getTransaction().commit();

                isSuccess = true;
                resStatus = HttpServletResponse.SC_CREATED;
                resObj.addProperty("message", "Channel created successfully.");
                resObj.add("channel", gson.toJsonTree(newChannel));

            }

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }

    }
}
