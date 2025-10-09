package com.example.streaum.services;

import com.example.streaum.entity.Server;
import com.example.streaum.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class ServerService {
    private final Session session;

    public ServerService(Session session) {
        this.session = session;
    }

    public Server findServerById(String id) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Server> cq = cb.createQuery(Server.class);
        Root<Server> root = cq.from(Server.class);

        cq.select(root).where(cb.equal(root.get("id"), id));

        List<Server> servers = session.createQuery(cq).getResultList();
        return servers.isEmpty() ? null : servers.get(0);
    }

}
