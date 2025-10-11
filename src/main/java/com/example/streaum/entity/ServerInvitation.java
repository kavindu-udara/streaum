package com.example.streaum.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "server_invitations")
public class ServerInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", referencedColumnName = "id", nullable = false)
    private Server server;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="expire_at")
    private Date expireAt;

    public MemberType getType() {
        return type;
    }

    public void setType(MemberType type) {
        this.type = type;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "member_type", length = 10, nullable = false)
    private MemberType type = MemberType.MEMBER;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="created_at")
    private Date createdAt;

    @PrePersist
    protected void onCreate(){
        createdAt = new Date();
    }

    public ServerInvitation() {}

    public ServerInvitation(Server server, Date expireAt) {
        this.server = server;
        this.expireAt = expireAt;
    }

    public ServerInvitation(Server server, Date expireAt, MemberType memberType) {
        this.server = server;
        this.expireAt = expireAt;
        this.type = memberType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public Date getExpireAt() {
        return expireAt;
    }

    public void setExpireAt(Date expireAt) {
        this.expireAt = expireAt;
    }
}
