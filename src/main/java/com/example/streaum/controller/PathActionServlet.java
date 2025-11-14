package com.example.streaum.controller;

import com.example.streaum.entity.PathAction;
import com.example.streaum.lib.FileOperations;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "PathActionServlet", urlPatterns = {"/path-action"})
public class PathActionServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject resObj = new JsonObject();
        Gson gson = new Gson();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        String action = request.getParameter("action");
        String path = request.getParameter("path");

        try {

            if (action == null || path == null) {
                resObj.addProperty("message", "Action and path are required.");
                return;
            }
            if (action.isEmpty() || path.isEmpty()) {
                resObj.addProperty("message", "Action and path are required.");
                return;
            }
            if (action.length() > 45 || path.length() > 45) {
                resObj.addProperty("message", "Action and path must be less than 45 characters.");
                return;
            }

            if (action.equals(PathAction.NEW_FOLDER.name())) {
                String name = request.getParameter("name");
                if (name == null || name.isEmpty()) {
                    resObj.addProperty("message", "New file or folder name is required.");
                    return;
                }
                FileOperations fileOperations = new FileOperations();
                String operationResult = fileOperations.createFolder(path, name);
                JsonObject operationResultJson = gson.fromJson(operationResult, JsonObject.class);

                resObj.addProperty("message", operationResultJson.get("message").getAsString());
                isSuccess = operationResultJson.get("success").getAsBoolean();
                if( isSuccess){
                    resStatus = HttpServletResponse.SC_OK;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }
    }
}
