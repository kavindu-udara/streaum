package com.example.streaum.services;

import com.example.streaum.entity.Admin;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class AdminService {

    private final Session session;

    public AdminService(Session session) {
        this.session = session;
    }

    public Admin findAdminByUsername(String username) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Admin> cq = cb.createQuery(Admin.class);
        Root<Admin> root = cq.from(Admin.class);

        cq.select(root).where(cb.equal(root.get("username"), username));

        List<Admin> admins = session.createQuery(cq).getResultList();
        return admins.isEmpty() ? null : admins.get(0);
    }

}
