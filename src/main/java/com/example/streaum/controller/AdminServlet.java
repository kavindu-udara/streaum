package com.example.streaum.controller;

import com.example.streaum.entity.Admin;
import com.example.streaum.entity.AdminType;
import com.example.streaum.entity.User;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.PasswordHandler;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;

@WebServlet(name = "AdminServlet", urlPatterns = {"/admin"})
public class AdminServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        JsonObject resObj = new JsonObject();

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String hashedPwd = PasswordHandler.hashPassword("admin");

            Admin newAdmin = new Admin("admin", hashedPwd, AdminType.SUPER_ADMIN);

            session.beginTransaction();
            session.persist(newAdmin);
            session.getTransaction().commit();

            isSuccess = true;
            resObj.addProperty("message", "User registered successfully.");
            resObj.addProperty("userId", newAdmin.getId());

            session.close();
        } catch (Exception e) {
            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }

}
