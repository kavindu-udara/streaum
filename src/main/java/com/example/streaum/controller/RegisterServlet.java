package com.example.streaum.controller;

import com.example.streaum.lib.RegexChecker;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "RegisterServlet", urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {
            String firstName = reqObj.get("firstName").getAsString();
            String lastName = reqObj.get("lastName").getAsString();
            String email = reqObj.get("email").getAsString();

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty()) {
                resObj.addProperty("message", "First name, last name and email are required.");
            }else if (firstName.length() > 45 || lastName.length() > 45 || email.length() > 100) {
                resObj.addProperty("message", "First name, last name and email must be less than 45 characters.");
            } else if (!RegexChecker.isValidNamePart(firstName)) {
                resObj.addProperty("message", "First name must contain only letters.");
            }else if (!RegexChecker.isValidNamePart(lastName)) {
                resObj.addProperty("message", "Last name must contain only letters.");
            }else if (!RegexChecker.isValidEmail(email)) {
                resObj.addProperty("message", "Email is not valid.");
            }else {
                isSuccess = true;
                resStatus = HttpServletResponse.SC_OK;

//            create logic
            }


        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        }finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }

}
