package com.example.streaum.controller;

import com.example.streaum.entity.UserHasServers;
import com.example.streaum.hibernate.HibernateUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;

@WebServlet(name = "TestServlet", urlPatterns = {"/test"})
public class TestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
//            UserHasServers userHasServers = new UserHasServers();
            response.getWriter().println("This is a test servlet response : ");
        } catch (Exception e) {
            response.getWriter().println("Error saving user: " + e.getMessage());
        }
    }

}
