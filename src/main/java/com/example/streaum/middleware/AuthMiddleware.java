package com.example.streaum.middleware;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/servers/*"})
public class AuthMiddleware implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        String token = httpRequest.getParameter("token");

        if(token == null || token.isEmpty()) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: Access denied");
            servletResponse.getWriter().println("Token is required.");
            return;
        }

        filterChain.doFilter(servletRequest, servletResponse);

    }
}
