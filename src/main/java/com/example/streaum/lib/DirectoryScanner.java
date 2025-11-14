package com.example.streaum.lib;

import com.example.streaum.entity.FileNode;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class DirectoryScanner {
    public static String scanDirectoryToJson(String folderPath) throws IOException {
        File rootFolder = new File(folderPath);

        if (!rootFolder.exists()) {
            throw new IOException("Folder does not exist: " + folderPath);
        }

        if (!rootFolder.isDirectory()) {
            throw new IOException("Path is not a directory: " + folderPath);
        }

        FileNode rootNode = buildEnhancedFileTree(rootFolder);

        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .create();

        return gson.toJson(rootNode);
    }

    private static FileNode buildEnhancedFileTree(File file) throws IOException {
        BasicFileAttributes attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
        long size = file.isDirectory() ? 0 : file.length();

        LocalDateTime lastModified = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(file.lastModified()),
                ZoneId.systemDefault()
        );

        FileNode node = new FileNode(
                file.getName(),
                file.getAbsolutePath(),
                file.isDirectory(),
                size,
                lastModified.toString()
        );

        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    if (!child.isHidden()) {
                        node.addChild(buildEnhancedFileTree(child));
                    }
                }
            }
        }

        return node;
    }
}
