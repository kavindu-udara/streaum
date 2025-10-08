package com.example.streaum.entity;

import com.example.streaum.lib.UUIDUtil;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "servers")
public class Server {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @Column(name = "name", length = 45, nullable = false)
    private String name;

    @Column(name = "image", nullable = true)
    private String image;

    public Server() {}

    public Server(String name) {
        this.name = name;
    }

    public Server(String name, String image) {
        this.name = name;
        this.image = image;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
