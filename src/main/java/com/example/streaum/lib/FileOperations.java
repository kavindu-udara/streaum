package com.example.streaum.lib;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class FileOperations {

    private final Gson gson;

    public FileOperations() {
        this.gson = new GsonBuilder()
                .setPrettyPrinting()
                .create();
    }

    public String createFolder(String parentPath, String folderName) {
        Map<String, Object> result = new HashMap<>();

        try {
            Path parentDir = Paths.get(parentPath);
            if (!Files.exists(parentDir)) {
                result.put("success", false);
                result.put("message", "Parent directory does not exist: " + parentPath);
                return gson.toJson(result);
            }

            if (!Files.isDirectory(parentDir)) {
                result.put("success", false);
                result.put("message", "Path is not a directory: " + parentPath);
                return gson.toJson(result);
            }

            Path newFolderPath = parentDir.resolve(folderName);

            if (Files.exists(newFolderPath)) {
                result.put("success", false);
                result.put("message", "Folder already exists: " + newFolderPath);
                return gson.toJson(result);
            }

            Files.createDirectory(newFolderPath);
            result.put("success", true);
            result.put("message", "Folder created successfully: " + newFolderPath);
            result.put("path", newFolderPath.toString());

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error creating folder: " + e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        }

        return gson.toJson(result);
    }

}
