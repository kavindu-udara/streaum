package com.example.streaum.services;

import com.example.streaum.entity.Server;
import com.example.streaum.entity.ServerInvitation;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class ServerInvitationService {
    private final Session session;

    public ServerInvitationService(Session session) {
        this.session = session;
    }

    public ServerInvitation findServerInvitationById(String id) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<ServerInvitation> cq = cb.createQuery(ServerInvitation.class);
        Root<ServerInvitation> root = cq.from(ServerInvitation.class);

        cq.select(root).where(cb.equal(root.get("id"), id));

        List<ServerInvitation> invitations = session.createQuery(cq).getResultList();
        return invitations.isEmpty() ? null : invitations.get(0);
    }

}
