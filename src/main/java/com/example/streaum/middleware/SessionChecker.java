package com.example.streaum.middleware;

import com.example.streaum.lib.ResponseHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter(urlPatterns = {"/upload/*", "/create-server/*", "/files/*", "/channels/*"})
public class SessionChecker implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;
        HttpSession session = req.getSession(false);

        if (session == null || session.getAttribute("user") == null) {
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("message", "Not logged in");

            ResponseHandler.SendResponseJson(res, HttpServletResponse.SC_UNAUTHORIZED, false, responseObject);
            return;
        }
            filterChain.doFilter(servletRequest, servletResponse);

    }
}
