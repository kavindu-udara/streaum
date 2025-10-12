package com.example.streaum.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_has_servers")
public class UserHasServers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 10, nullable = false)
    private MemberType type = MemberType.MEMBER;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", referencedColumnName = "id", nullable = false)
    private Server server;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    public UserHasServers() {
    }

    public UserHasServers(MemberType type, Server server, User user) {
        this.type = type;
        this.server = server;
        this.user = user;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public MemberType getType() { return type; }
    public void setType(MemberType type) { this.type = type; }

    public Server getServer() { return server; }
    public void setServer(Server server) { this.server = server; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}