package com.example.streaum.controller;

import com.example.streaum.lib.Constants;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

@WebServlet(name = "GetFiles", urlPatterns = {"/files/*"})
public class GetFiles extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject resObj = new JsonObject();
        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {
            // Get the filename from the URL path
            String fileName = req.getPathInfo();
            if (fileName == null || fileName.equals("/") || fileName.isEmpty()) {
                resObj.addProperty("message", "File name is required.");
                ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
                return;
            }

            fileName = fileName.substring(1); // remove leading '/'
            String filesDir = Constants.getUploadDir();
            File file = new File(filesDir, fileName);

            // Check if file exists
            if (!file.exists() || !file.isFile()) {
                resStatus = HttpServletResponse.SC_NOT_FOUND;
                resObj.addProperty("message", "File not found.");
                ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
                return;
            }

            // Detect content type (e.g., image/jpeg, video/mp4, etc.)
            String mimeType = Files.probeContentType(file.toPath());
            if (mimeType == null) {
                mimeType = "application/octet-stream"; // default binary
            }

            // Set response headers for browser
            response.setContentType(mimeType);
            response.setContentLengthLong(file.length());

            // Stream file bytes to response output
            try (FileInputStream in = new FileInputStream(file);
                 OutputStream out = response.getOutputStream()) {

                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }
    }
}
