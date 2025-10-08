package com.example.streaum.lib;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class FileHandler {

    private static final Dotenv dotenv = Dotenv.load();
    private static final String UPLOAD_PATH = dotenv.get("UPLOAD_PATH");

    public static String uploadFile(Part filePart) throws IOException {

        String uploadDir = System.getenv().getOrDefault(UPLOAD_PATH, "/Users/user/Desktop/uploads/streaum/files");
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs(); // make sure folder exists
        }

        String originalFileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();

        String extension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFileName.length() - 1) {
            extension = originalFileName.substring(dotIndex);
        }

        String randomFileName = UUIDUtil.generateUUID().replace("-", "") + extension;

        File uploadDirFilePath = new File(uploadDir); // make sure this is the actual images folder path
        if (!uploadDirFilePath.exists()) {
            uploadDirFilePath.mkdirs();
        }

        File file = new File(uploadDirFile, randomFileName);

        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }

        System.out.println("Saved file to: " + file.getAbsolutePath());

        return randomFileName;
    }

}
