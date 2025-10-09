package com.example.streaum.controller;

import com.example.streaum.lib.FileHandler;
import com.example.streaum.lib.JwtUtil;
import com.example.streaum.lib.ResponseHandler;
import com.example.streaum.lib.UUIDUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@WebServlet(name = "UploadServlet", urlPatterns = {"/upload"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,  // 1MB before writing to disk
        maxFileSize = 1024 * 1024 * 100,      // 100MB max file size
        maxRequestSize = 1024 * 1024 * 120    // 120MB max request size
)
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{

        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {
            // Create "files" directory if not exists
            String uploadDir = getServletContext().getRealPath("/files");
            Files.createDirectories(Paths.get(uploadDir));

            // Retrieve the uploaded file part (the form field name must match "file")
            Part filePart = request.getPart("file");
            if (filePart == null || filePart.getSize() == 0) {
                resObj.addProperty("message", "No file uploaded.");
                return;
            }

            String newFileName = FileHandler.uploadFile(filePart);

            isSuccess = true;
            resStatus = HttpServletResponse.SC_OK;
            resObj.addProperty("message", "File uploaded successfully.");
            resObj.addProperty("fileName", newFileName);
        } catch (Exception e) {
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }
}
