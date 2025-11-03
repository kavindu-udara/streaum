package com.example.streaum.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin extends BaseEntity{

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "username", length = 45, nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated
    @Column(name = "type", length = 10)
    private AdminType type = AdminType.SUPER_ADMIN;

    public Admin() {}

    public Admin(String name, String password, AdminType type) {
        this.name = name;
        this.password = password;
        this.type = type;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AdminType getType() {
        return type;
    }

    public void setType(AdminType type) {
        this.type = type;
    }
}
