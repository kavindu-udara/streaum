package com.example.streaum.controller;

import com.example.streaum.entity.User;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.*;
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
import java.util.Map;

@WebServlet(name = "Login", urlPatterns = {"/login"})
public class LoginServlet  extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            String email = reqObj.get("email").getAsString();
            String password = reqObj.get("password").getAsString();

            if (email.length() > 100) {
                resObj.addProperty("message", "Email must be less than 45 characters.");
            } else if (!RegexChecker.isValidEmail(email)) {
                resObj.addProperty("message", "Email is not valid.");
            } else if (!RegexChecker.isValidPassword(password)) {
                resObj.addProperty("message", "Password must contain at least one digit, one lowercase letter, one uppercase letter and one special character.");
            } else{

//                check user with this email exists
                UserService userService = new UserService(session);

                User foundUser = userService.findUserByEmail(email);
                if (foundUser == null) {
                    resObj.addProperty("message", "User not found.");
                    return;
                }

//                check password is match
                if(!PasswordHandler.verifyPassword(password, foundUser.getPassword())) {
                    resObj.addProperty("message", "Passwords does not match.");
                    return;
                }

//                generate jwt
                Map<String, Object> claims = Map.of(
                        "userId", foundUser.getId(),
                        "firstName", foundUser.getFirstName(),
                        "lastName", foundUser.getLastName(),
                        "email", foundUser.getEmail()
                );

                String jwt = JwtUtil.generateToken(claims);

                isSuccess = true;
                resStatus = HttpServletResponse.SC_OK;
                resObj.addProperty("message", "Login successful.");
                resObj.addProperty("token", jwt);

            }

        } catch (Exception e) {
//            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
            session.close();
        }
    }

}
