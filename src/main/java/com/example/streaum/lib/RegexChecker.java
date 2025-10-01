package com.example.streaum.lib;

public class RegexChecker {

    public static final String EMAIL_REGEX = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
    public static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=])(?=\\S+$).{8,}$";
    public static final String NAME_PART_REGEX = "^[a-zA-Z]{1,45}$";

    public static boolean isValidEmail(String email) {
        return email.matches(EMAIL_REGEX);
    }

    public static boolean isValidPassword(String password) {
        return password.matches(PASSWORD_REGEX);
    }

    public static boolean isValidNamePart(String namePart) {
        return namePart.matches(NAME_PART_REGEX);
    }

}
