package com.example.streaum.controller;

import com.example.streaum.entity.*;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.DateTimeUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.ServerService;
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
import java.util.Date;
import java.util.Set;

@WebServlet(name = "ServerInvitationServllet", urlPatterns = {"/server-invitation"})
public class ServerInvitationServllet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();


        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {

            HttpSession reqSession = request.getSession(false);
            User selectedUser = (User) reqSession.getAttribute("user");

            String serverId = reqObj.get("serverId").getAsString();
            String expireTimePeriod = reqObj.get("expireTimePeriod").getAsString();

            if (serverId.isEmpty() || expireTimePeriod.isEmpty()) {
                resObj.addProperty("message", "serverId and expireTimePeriod are required.");
                return;
            }

            // Validate expireTimePeriod against allowed values
            Set<String> allowed = Set.of("ONEHOUR", "ONEDAY", "ONEWEEK");
            if (!allowed.contains(expireTimePeriod)) {
                resObj.addProperty("message", "expireTimePeriod must be either ONEHOUR, ONEDAY or ONEWEEK.");
                return;
            }

            String type = null;
            if (reqObj.get("type") != null) {
                if (!reqObj.get("type").getAsString().isEmpty()) {
                    type = reqObj.get("type").getAsString();
                    Set<String> allowedTypes = Set.of("ADMIN", "MEMBER");
                    if (!allowedTypes.contains(type)) {
                        resObj.addProperty("message", "type must be either ADMIN or MEMBER.");
                        return;
                    }
                }
            }

//            find selected user relationship with the server
            if (selectedUser == null) {
                resObj.addProperty("message", "User not found.");
                return;
            }

//            find server
            ServerService serverService = new ServerService(session);
            Server foundServer = serverService.findServerById(serverId);

            if (foundServer == null) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "Server not found.");
                return;
            }

            UserHasServersService userHasServersService = new UserHasServersService(session);
            UserHasServers foundUserHasServers = userHasServersService.findUserHasServersByUserAndServer(selectedUser, foundServer);

            if (foundUserHasServers == null) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "User is not a member of this server.");
                return;
            }

            if (!foundUserHasServers.getType().toString().equals(MemberType.CREATOR.toString()) || foundUserHasServers.getType().toString().equals(MemberType.ADMIN.toString())) {
                resStatus = HttpServletResponse.SC_BAD_REQUEST;
                resObj.addProperty("message", "You are not allowed to invite users to this server." + foundUserHasServers.getType() + " is not allowed.");
                return;
            }

            MemberType memberType = MemberType.MEMBER;
            if (type.equals("ADMIN")) {
                memberType = MemberType.ADMIN;
            }

            InvitationExpireTimePeriod invitationExpireTimePeriod = InvitationExpireTimePeriod.ONEDAY;
            if (expireTimePeriod.equals("ONEHOUR")) {
                invitationExpireTimePeriod = InvitationExpireTimePeriod.ONEHOUR;
            } else if (expireTimePeriod.equals("ONEWEEK")) {
                invitationExpireTimePeriod = InvitationExpireTimePeriod.ONEWEEK;
            }

            Date expireTime = DateTimeUtil.expandDateByInvitationExpireTimePeriod(invitationExpireTimePeriod);

            ServerInvitation newServerInvitation;
            if (type == null) {
                newServerInvitation = new ServerInvitation(foundServer, expireTime);
            } else {
                newServerInvitation = new ServerInvitation(foundServer, expireTime, memberType);
            }

            session.beginTransaction();
            session.persist(newServerInvitation);
            session.getTransaction().commit();

            isSuccess = true;
            resStatus = HttpServletResponse.SC_CREATED;

            resObj.addProperty("message", "User registered successfully.");
            resObj.addProperty("invitationId", newServerInvitation.getId());

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            session.close();
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }
    }
}
