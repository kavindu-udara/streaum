package com.example.streaum.entity;

import com.example.streaum.lib.UUIDUtil;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "servers")
public class Server {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name", length = 45, nullable = false)
    private String name;

    public Server() {
        this.id = UUIDUtil.generateUUID();
    }

    public Server(String name) {
        this.id = UUIDUtil.generateUUID();
        this.name = name;
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

}
