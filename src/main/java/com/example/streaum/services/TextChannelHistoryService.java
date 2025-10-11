package com.example.streaum.services;

import com.example.streaum.entity.Channel;
import com.example.streaum.entity.Server;
import com.example.streaum.entity.TextChannelHistory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class TextChannelHistoryService {
    private final Session session;

    public TextChannelHistoryService(Session session) {
        this.session = session;
    }

    public List<TextChannelHistory> findAllHistoyByChannel(Channel channel){
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<TextChannelHistory> cq = cb.createQuery(TextChannelHistory.class);
        Root<TextChannelHistory> root = cq.from(TextChannelHistory.class);

        cq.select(root).where( cb.equal(root.get("channel"), channel));

        return session.createQuery(cq).getResultList();
    }

}
