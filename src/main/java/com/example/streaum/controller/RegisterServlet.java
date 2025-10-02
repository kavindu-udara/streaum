package com.example.streaum.controller;

import com.example.streaum.entity.User;
import com.example.streaum.hibernate.HibernateUtil;
import com.example.streaum.lib.PasswordHandler;
import com.example.streaum.lib.RegexChecker;
import com.example.streaum.lib.ResponseHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;

import java.io.IOException;

@WebServlet(name = "RegisterServlet", urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws IOException {
        Gson gson = new Gson();
        JsonObject reqObj = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resObj = new JsonObject();

        boolean isSuccess = false;
        int resStatus = HttpServletResponse.SC_BAD_REQUEST;

        try {
            String firstName = reqObj.get("firstName").getAsString();
            String lastName = reqObj.get("lastName").getAsString();
            String email = reqObj.get("email").getAsString();
            String password = reqObj.get("password").getAsString();

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
                resObj.addProperty("message", "First name, last name email and password are required.");
            } else if (firstName.length() > 45 || lastName.length() > 45 || email.length() > 100) {
                resObj.addProperty("message", "First name, last name and email must be less than 45 characters.");
            } else if (!RegexChecker.isValidNamePart(firstName)) {
                resObj.addProperty("message", "First name must contain only letters.");
            } else if (!RegexChecker.isValidNamePart(lastName)) {
                resObj.addProperty("message", "Last name must contain only letters.");
            } else if (!RegexChecker.isValidEmail(email)) {
                resObj.addProperty("message", "Email is not valid.");
            } else if (!RegexChecker.isValidPassword(password)) {
                resObj.addProperty("message", "Password must contain at least one digit, one lowercase letter, one uppercase letter and one special character.");
            } else {

                Session session = HibernateUtil.getSessionFactory().openSession();

                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<User> cq = cb.createQuery(User.class);
                Root<User> root = cq.from(User.class);

                cq.select(root).where(cb.equal(root.get("email"), email));

                if (!session.createQuery(cq).getResultList().isEmpty()) {
                    resObj.addProperty("message", "Email is already registered.");
                    session.close();
                    return;
                }

                String hashedPwd = PasswordHandler.hashPassword(password);

                User newUser = new User(firstName, lastName, email, hashedPwd);

                // Create EntityManagerFactory once (usually in a Singleton / Startup)
                EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-persistence-unit");

                // For each request
                EntityManager em = emf.createEntityManager();

                em.getTransaction().begin();
                em.persist(newUser);  // instead of session.save()
                em.getTransaction().commit();
                em.close();

                isSuccess = true;
                resStatus = HttpServletResponse.SC_OK;

                resObj.addProperty("message", "User registered successfully.");
                resObj.addProperty("userId", newUser.getId());

                session.close();

            }

        } catch (Exception e) {
//            e.printStackTrace();
            resObj.addProperty("message", e.getMessage());
        } finally {
            ResponseHandler.SendResponseJson(response, resStatus, isSuccess, resObj);
        }

    }

}
