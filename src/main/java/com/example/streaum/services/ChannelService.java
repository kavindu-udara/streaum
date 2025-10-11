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

    public Channel findChannelById(String id) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);
        cq.select(root).where(cb.equal(root.get("id"), id));
        List<Channel> channels = session.createQuery(cq).getResultList();
        return channels.isEmpty() ? null : channels.get(0);
    }

    // Fix: combine predicates and compare enum with enum (not toString)
    public Channel findChannelByNameServerAndType(Server server, String name, ChannelType type) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);

        cq.select(root).where(
            cb.and(
                cb.equal(root.get("server"), server),
                cb.equal(root.get("name"), name),
                cb.equal(root.get("type"), type)
            )
        );

        List<Channel> channels = session.createQuery(cq).setMaxResults(1).getResultList();
        return channels.isEmpty() ? null : channels.get(0);
    }

    public List<Channel> findAllChannelsByNameServer(Server server) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);
        cq.select(root).where(cb.equal(root.get("server"), server));
        cq.orderBy(cb.asc(root.get("name")));
        return session.createQuery(cq).getResultList();
    }

    public Channel findChannelsByNameServer(Server server) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);
        cq.select(root).where(cb.equal(root.get("server"), server));
        cq.orderBy(cb.asc(root.get("name")));

        List<Channel> channels = session.createQuery(cq).getResultList();
        return channels.isEmpty() ? null : channels.get(0);
    }

    // Fix: don't overwrite WHERE; combine server and type
    public List<Channel> findAllChannelsByNameServerAndType(Server server, ChannelType type) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Channel> cq = cb.createQuery(Channel.class);
        Root<Channel> root = cq.from(Channel.class);

        cq.select(root).where(
            cb.and(
                cb.equal(root.get("server"), server),
                cb.equal(root.get("type"), type)
            )
        );
        cq.orderBy(cb.asc(root.get("name")));

        return session.createQuery(cq).getResultList();
    }


}