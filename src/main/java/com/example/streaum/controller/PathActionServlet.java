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
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        String action = reqObj.get("action").getAsString();
        String path = reqObj.get("path").getAsString();

        System.out.println(action);
        System.out.println(path);

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

            FileOperations fileOperations = new FileOperations();

            if (action.equals(PathAction.NEW_FOLDER.name())) {
                String name = reqObj.get("name").getAsString();
                if (name == null || name.isEmpty()) {
                    resObj.addProperty("message", "New file or folder name is required.");
                    return;
                }
                String operationResult = fileOperations.createFolder(path, name);
                JsonObject operationResultJson = gson.fromJson(operationResult, JsonObject.class);

                resObj.addProperty("message", operationResultJson.get("message").getAsString());
                isSuccess = operationResultJson.get("success").getAsBoolean();
                if (isSuccess) {
                    resStatus = HttpServletResponse.SC_OK;
                }
            } else if (action.equals((PathAction.DELETE.name()))) {
                String name = reqObj.get("name").getAsString();
                if (name == null || name.isEmpty()) {
                    resObj.addProperty("message", "File or folder name is required.");
                    return;
                }
                String operationResult = fileOperations.deletePath(path);
                JsonObject operationResultJson = gson.fromJson(operationResult, JsonObject.class);

                resObj.addProperty("message", operationResultJson.get("message").getAsString());
                isSuccess = operationResultJson.get("success").getAsBoolean();
                if (isSuccess) {
                    resStatus = HttpServletResponse.SC_OK;
                }
            } else if (action.equals((PathAction.FORCE_DELETE.name()))) {
                String name = reqObj.get("name").getAsString();
                if (name == null || name.isEmpty()) {
                    resObj.addProperty("message", "File or folder name is required.");
                    return;
                }
                String operationResult = fileOperations.deletePathRecursive(path);
                JsonObject operationResultJson = gson.fromJson(operationResult, JsonObject.class);

                resObj.addProperty("message", operationResultJson.get("message").getAsString());
                isSuccess = operationResultJson.get("success").getAsBoolean();
                if (isSuccess) {
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
