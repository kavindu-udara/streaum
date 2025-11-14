package com.example.streaum.controller;

import com.example.streaum.lib.DirectoryScanner;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "FilePathServlet", urlPatterns = {"/file-path"})
public class FilePathServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        JsonObject resObj = new JsonObject();
        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        String path = request.getParameter("path");

        try {
            resStatus = HttpServletResponse.SC_OK;
            isSuccess = true;
            String folderPath = "/Users/user/Desktop/test/";

            if (path != null) {
                folderPath = path;
                if (!folderPath.endsWith("/")) {
                    folderPath += "/";
                }
                if (!folderPath.startsWith("/")) {
                    folderPath = "/" + folderPath;
                }
                System.out.println(folderPath);
            }

            String json = DirectoryScanner.scanDirectoryToJson(folderPath);
            System.out.println(json);
            resObj.addProperty("path" , json);
        }catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }
    }
}
