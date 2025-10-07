package com.example.streaum.controller;

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
//            String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteS1hcHAiLCJpYXQiOjE3NTk4Njg0MjgsImV4cCI6MTc1OTg3MjAyOCwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwidXNlcklkIjoxLCJsYXN0TmFtZSI6ImxuYW1lIiwiZmlyc3ROYW1lIjoiZm5hbWUifQ.dwhUFIEEDJrQePevzPWaIjAG8DwLbpb91o-BPKwcYeU";
            if(token == null || token.isEmpty()) {
                resObj.addProperty("message", "Token is required.");
                return;
            }

//            verify token
            if(JwtUtil.verifyToken(token) == null) {
                resObj.addProperty("message", "Token is invalid.");
                return;
            }

            // find user by token
            UserService userService = new UserService(session);
            User selectedUser = userService.findUserByToken(token);

            if(selectedUser == null) {
                resObj.addProperty("message", "User not found.");
                return;
            }

//            find servers list with user
            UserHasServersService userHasServersService = new UserHasServersService(session);

            List<UserHasServers> userHasServersList = userHasServersService.findAllUserHasServersByUser(selectedUser);

            if(userHasServersList == null || userHasServersList.isEmpty()) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "No servers found.");
                return;
            }

            isSuccess = true;
            resStatus = HttpServletResponse.SC_OK;
            resObj.addProperty("message", "Servers found successfully.");
            resObj.add("serverList", gson.toJsonTree(userHasServersList));

        } catch (Exception e) {
//            throw new RuntimeException(e);
            resObj.addProperty("message", e.getMessage());
        }finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }

    }
}
