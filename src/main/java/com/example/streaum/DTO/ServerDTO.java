package com.example.streaum.DTO;

import com.example.streaum.entity.UserHasServers;

public class ServerDTO {

    private String id;
    private String name;
    private String image;

    public ServerDTO(UserHasServers entity) {
        this.id = entity.getServer().getId();
        this.name = entity.getServer().getName();
        this.image = entity.getServer().getImage();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
