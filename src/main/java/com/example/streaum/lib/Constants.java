package com.example.streaum.lib;

import io.github.cdimascio.dotenv.Dotenv;

public class Constants {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String FILE_PATH = dotenv.get("UPLOAD_PATH");

    private static String uploadDir = System.getenv().getOrDefault(FILE_PATH, "/Users/user/Desktop/uploads/streaum/files");

    public static String getUploadDir() {
        return uploadDir;
    }

}
