package com.example.streaum.DTO;

public class TextChannelMessageDTO {
    private String text;
    private String name;
    private String sender;
    private String createdAt;
    private String id;
    private String token;

    public String getMessage() {
        return text;
    }

    public void setMessage(String message) {
        this.text = message;
    }

    public String getName() {
        return name;
    }

    public String getUserId() {
        return id;
    }

    public void setUserId(String userId) {
        this.id = userId;
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

    public TextChannelMessageDTO(String userId, String message, String name, String createdAt, String token, String sender) {
        this.text = message;
        this.name = name;
        this.createdAt = createdAt;
        this.id = userId;
        this.token = token;
        this.sender = sender;
    }
}
