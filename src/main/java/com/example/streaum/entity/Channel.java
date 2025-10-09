package com.example.streaum.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "channels")
public class Channel {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "server_id", referencedColumnName = "id", nullable = false)
    private Server server;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 10, nullable = false)
    private ChannelType type = ChannelType.TEXT;

    public Channel() {}

    public Channel(String name, Server server) {
        this.name = name;
        this.server = server;
    }

    public Channel(String name, Server server, ChannelType type) {
        this.name = name;
        this.server = server;
        this.type = type;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ChannelType getType() {
        return type;
    }

    public void setType(ChannelType type) {
        this.type = type;
    }
}
