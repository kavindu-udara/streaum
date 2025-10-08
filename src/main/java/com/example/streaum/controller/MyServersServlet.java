package com.example.streaum.controller;

import com.example.streaum.DTO.ServerDTO;
import com.example.streaum.entity.User;
import com.example.streaum.entity.UserHasServers;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.JwtUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.UserHasServersService;
import com.example.streaum.services.UserService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;
import java.util.List;

@WebServlet(name = "MyServersServlet", urlPatterns = {"/my-servers"})
public class MyServersServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            String token = (String) request.getAttribute("token");

            if (token == null || token.isEmpty()) {
                resObj.addProperty("message", "Token is required.");
                return;
            }

//            verify token
            if (JwtUtil.verifyToken(token) == null) {
                resObj.addProperty("message", "Token is invalid.");
                return;
            }

            // find user by token
            UserService userService = new UserService(session);
            User selectedUser = userService.findUserByToken(token);

            if (selectedUser == null) {
                resObj.addProperty("message", "User not found.");
                return;
            }

//            find servers list with user
            UserHasServersService userHasServersService = new UserHasServersService(session);

            List<UserHasServers> entities = userHasServersService.findAllUserHasServersByUser(selectedUser);
            List<ServerDTO> servers = entities.stream()
                    .map(ServerDTO::new)
                    .toList();

            if (entities.isEmpty()) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "No servers found.");
                return;
            }

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
