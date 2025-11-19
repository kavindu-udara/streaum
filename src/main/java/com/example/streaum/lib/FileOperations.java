package com.example.streaum.lib;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
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

    public String deletePath(String pathToDelete) {
        Map<String, Object> result = new HashMap<>();

        try {
            Path targetPath = Paths.get(pathToDelete);

            if (!Files.exists(targetPath)) {
                result.put("success", false);
                result.put("message", "Path does not exist: " + pathToDelete);
                return gson.toJson(result);
            }

            // Check if it's a directory and not empty
            if (Files.isDirectory(targetPath)) {
                if (isDirectoryNotEmpty(targetPath)) {
                    result.put("success", false);
                    result.put("message", "Directory is not empty: " + pathToDelete);
                    result.put("type", "directory");
                    return gson.toJson(result);
                }
            }

            // Delete the file or directory
            Files.delete(targetPath);

            result.put("success", true);
            result.put("message", "Successfully deleted: " + pathToDelete);
            result.put("path", pathToDelete);
            result.put("type", Files.isDirectory(targetPath) ? "directory" : "file");
        } catch (DirectoryNotEmptyException e) {
            result.put("success", false);
            result.put("message", "Directory is not empty. Use recursive delete if needed: " + pathToDelete);
            result.put("type", "directory");
            result.put("exception", "DirectoryNotEmptyException");
        } catch (NoSuchFileException e) {
            result.put("success", false);
            result.put("message", "File or directory does not exist: " + pathToDelete);
            result.put("exception", "NoSuchFileException");
        } catch (IOException e) {
            result.put("success", false);
            result.put("message", "IO error deleting path: " + e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        } catch (SecurityException e) {
            result.put("success", false);
            result.put("message", "Permission denied: " + e.getMessage());
            result.put("exception", "SecurityException");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Unexpected error: " + e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        }

        return gson.toJson(result);
    }

    public String deletePathRecursive(String pathToDelete) {
        Map<String, Object> result = new HashMap<>();

        try {
            Path targetPath = Paths.get(pathToDelete);

            if (!Files.exists(targetPath)) {
                result.put("success", false);
                result.put("message", "Path does not exist: " + pathToDelete);
                return gson.toJson(result);
            }

            // Use Files.walkFileTree to delete recursively
            Files.walkFileTree(targetPath, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
            result.put("success", true);
            result.put("message", "Successfully deleted recursively: " + pathToDelete);
            result.put("path", pathToDelete);
            result.put("type", "directory");
            result.put("recursive", true);

        } catch (NoSuchFileException e) {
            result.put("success", false);
            result.put("message", "File or directory does not exist: " + pathToDelete);
            result.put("exception", "NoSuchFileException");
        } catch (IOException e) {
            result.put("success", false);
            result.put("message", "IO error during recursive deletion: " + e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        } catch (SecurityException e) {
            result.put("success", false);
            result.put("message", "Permission denied: " + e.getMessage());
            result.put("exception", "SecurityException");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Unexpected error: " + e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        }

        return gson.toJson(result);
    }

    private boolean isDirectoryNotEmpty(Path directory) throws IOException {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
            return stream.iterator().hasNext();
        }
    }

}
