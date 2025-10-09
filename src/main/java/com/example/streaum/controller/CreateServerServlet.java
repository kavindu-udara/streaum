package com.example.streaum.controller;

import com.example.streaum.entity.MemberType;
import com.example.streaum.entity.Server;
import com.example.streaum.entity.User;
import com.example.streaum.entity.UserHasServers;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.ResponseHandler;
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

@WebServlet(name = "CreateServerServlet", urlPatterns = {"/create-server"})
public class CreateServerServlet extends HttpServlet {
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

            if (selectedUser == null) {
                resObj.addProperty("message", "User not found.");
                return;
            }

            if (reqObj.get("name") == null) {
                resObj.addProperty("message", "Name is required.");
                return;
            }

            String name = reqObj.get("name").getAsString();
            String imageUrl = null;
            if (reqObj.get("imageUrl") != null) {
                if (!reqObj.get("imageUrl").getAsString().isEmpty()) {
                    imageUrl = reqObj.get("imageUrl").getAsString();
                }
            }

            if (name.isEmpty()) {
                resObj.addProperty("message", "Name is required.");
                return;
            } else if (name.length() > 45) {
                resObj.addProperty("message", "Name must be less than 45 characters.");
                return;
            }

            Server server = new Server();

            server.setName(name);
            if (imageUrl != null) {
                server.setImage(imageUrl);
            }

            UserHasServers userHasServers = new UserHasServers(MemberType.CREATOR, server, selectedUser);

            session.beginTransaction();
            session.persist(server);
            session.persist(userHasServers);
            session.getTransaction().commit();

            isSuccess = true;
            resStatus = HttpServletResponse.SC_CREATED;
            resObj.addProperty("message", "Server created successfully.");
            resObj.add("server", gson.toJsonTree(server));

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }

    }
}
