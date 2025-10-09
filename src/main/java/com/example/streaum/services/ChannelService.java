package com.example.streaum.services;

import com.example.streaum.entity.Channel;
import com.example.streaum.entity.ChannelType;
import com.example.streaum.entity.Server;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class ChannelService {
    private final Session session;

    public ChannelService(Session session) {
        this.session = session;
    }

    public Channel findChannelByNameServerAndType(Server server, String name, ChannelType type) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);

        cq.select(root).where(cb.equal(root.get("server"), server));
        cq.select(root).where(cb.equal(root.get("name"), name));
        cq.select(root).where(cb.equal(root.get("type"), type.toString()));

        List<Channel> channels = session.createQuery(cq).getResultList();
        return channels.isEmpty() ? null : channels.get(0);
    }

}
