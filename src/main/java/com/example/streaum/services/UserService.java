package com.example.streaum.services;

import com.example.streaum.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import org.hibernate.Session;
import jakarta.persistence.criteria.Root;

import java.util.List;

public class UserService {

    private final Session session;

    public UserService(Session session){
        this.session = session;
    }

    public User findUserByEmail(String email) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<User> cq = cb.createQuery(User.class);
            Root<User> root = cq.from(User.class);

            cq.select(root).where(cb.equal(root.get("email"), email));

            List<User> users = session.createQuery(cq).getResultList();
            return users.isEmpty() ? null : users.get(0);
    }

    public User findUserByToken(String token) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<User> cq = cb.createQuery(User.class);
            Root<User> root = cq.from(User.class);

            cq.select(root).where(cb.equal(root.get("token"), token));

            List<User> users = session.createQuery(cq).getResultList();
            return users.isEmpty() ? null : users.get(0);
    }

}
