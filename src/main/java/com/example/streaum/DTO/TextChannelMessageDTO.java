package com.example.streaum.DTO;

public class TextChannelMessageDTO {
    private String message;
    private String name;
    private String createdAt;
    private String userId;
    private String token;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTokenId() {
        return token;
    }

    public void setTokenId(String tokenId) {
        this.token = tokenId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public TextChannelMessageDTO(String userId, String message, String name, String createdAt, String token) {
        this.message = message;
        this.name = name;
        this.createdAt = createdAt;
        this.userId = userId;
        this.token = token;
    }
}
