package com.example.streaum.services;

import com.example.streaum.entity.Server;
import com.example.streaum.entity.User;
import com.example.streaum.entity.UserHasServers;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;

import java.util.List;

public class UserHasServersService {

    private final Session session;

    public UserHasServersService(Session session) {
        this.session = session;
    }

    public List<UserHasServers> findAllUserHasServersByUser(User user) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<UserHasServers> cq = cb.createQuery(UserHasServers.class);
        Root<UserHasServers> root = cq.from(UserHasServers.class);
        cq.select(root).where(cb.equal(root.get("user"), user));

        List<UserHasServers> userHasServersList = session.createQuery(cq).getResultList();
        return userHasServersList.isEmpty() ? null : userHasServersList;
    }

    public UserHasServers findUserHasServersByUserAndServer(User user, Server server) {
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<UserHasServers> cq = cb.createQuery(UserHasServers.class);
        Root<UserHasServers> root = cq.from(UserHasServers.class);

        cq.select(root).where(cb.equal(root.get("user"), user));
        cq.select(root).where(cb.equal(root.get("server"), server));

        List<UserHasServers> userHasServersList = session.createQuery(cq).getResultList();
        return userHasServersList.isEmpty() ? null : userHasServersList.get(0);
    }

}
