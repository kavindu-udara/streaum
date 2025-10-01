package com.example.streaum.controller;

import com.example.streaum.entity.User;
import com.example.streaum.hibernate.HibernateUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.IOException;

@WebServlet(name = "TestServlet", urlPatterns = {"/test"})
public class TestServlet extends HttpServlet {

    //
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Create a Hibernate session
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = null;

        try {
            // Begin transaction
            tx = session.beginTransaction();

            // Create a new User object
            User user = new User();
            user.setFirstName("John");
            user.setLastName("Doe");

            // Save user
            session.persist(user);

            // Commit transaction
            tx.commit();

            response.getWriter().println("✅ User saved successfully with ID: " + user.getId());

        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            e.printStackTrace();
            response.getWriter().println("❌ Error saving user: " + e.getMessage());
        } finally {
            session.close();
        }
    }

}
