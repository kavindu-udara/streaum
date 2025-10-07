package com.example.streaum.controller;

import com.example.streaum.entity.Server;
import com.example.streaum.hibernate.HibernateUtil;
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

@WebServlet(name = "ServersServlet", urlPatterns = {"/servers"})
public class ServersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Session session = HibernateUtil.getSessionFactory().openSession();
        session.beginTransaction();
        Server server = new Server("First Server");
        session.persist(server);
        session.getTransaction().commit();
        session.close();

        response.getWriter().println("This is a server servlet response : ");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {
            String name = reqObj.get("name").getAsString();

            if(name.isEmpty()){
                resObj.addProperty("message", "Name is required.");
            }else{

                Session session = HibernateUtil.getSessionFactory().openSession();

                Server server = new Server(name);
                session.beginTransaction();
                session.persist(server);
                session.getTransaction().commit();
                session.close();

                isSuccess = true;
                resStatus = HttpServletResponse.SC_CREATED;

                resObj.addProperty("message", "Server created successfully.");
                resObj.addProperty("serverId", server.getId());

            }

        } catch (Exception e) {
//            throw new RuntimeException(e);
            resObj.addProperty("message", e.getMessage());
        }finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }
}
