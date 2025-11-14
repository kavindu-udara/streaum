package com.example.streaum.controller;

import com.example.streaum.entity.Admin;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.JwtUtil;
import com.example.streaum.lib.PasswordHandler;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.services.AdminService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;
import java.util.Map;

@WebServlet(name = "AuthAdminServlet", urlPatterns = {"/admin-login"})
public class AuthAdminServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {

            String username = reqObj.get("username").getAsString();
            String password = reqObj.get("password").getAsString();

            if (username.isEmpty() || password.isEmpty()) {
                resObj.addProperty("message", "Username and password are required.");
            } else if (username.length() > 45 || password.length() > 45) {
                resObj.addProperty("message", "Username and password must be less than 45 characters.");
            } else {

                Session session = HibernateUtil.getSessionFactory().openSession();

//                Check admin with username
                AdminService adminService = new AdminService(session);

                Admin foundAdmin = adminService.findAdminByUsername(username);
                if (foundAdmin == null) {
                    resStatus = HttpServletResponse.SC_NOT_FOUND;
                    resObj.addProperty("message", "Admin not found.");
                    return;
                }

//                validate password
                if(!PasswordHandler.verifyPassword(password, foundAdmin.getPassword())) {
                    resObj.addProperty("message", "Passwords does not match.");
                    return;
                }

                Map<String, Object> claims = Map.of(
                        "id", foundAdmin.getId(),
                        "username", foundAdmin.getUsername()
                );

                String jwt = JwtUtil.generateToken(claims);

                isSuccess = true;
                resStatus = HttpServletResponse.SC_OK;
                resObj.addProperty("message", "Admin authenticated successfully.");
                resObj.addProperty("token", jwt);

            }

        }catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }
    }


}
