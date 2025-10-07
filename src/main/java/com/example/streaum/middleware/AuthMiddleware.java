package com.example.streaum.middleware;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/servers/*", "/my-servers/*"})
public class AuthMiddleware implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(httpRequest.getReader(), JsonObject.class);

        String token = reqObj.get("token").getAsString();

        if(token == null || token.isEmpty()) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: Access denied");
            servletResponse.getWriter().println("Token is required.");
            return;
        }

        // make token available to controller
        httpRequest.setAttribute("token", token);

        filterChain.doFilter(servletRequest, servletResponse);

    }
}
