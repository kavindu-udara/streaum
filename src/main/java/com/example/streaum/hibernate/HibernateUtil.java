package com.example.streaum.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import com.example.streaum.entity.*;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        try {
            // Read environment variables
            String dbName = System.getenv("DB_NAME");
            String dbUser = System.getenv("DB_USER");
            String dbPass = System.getenv("DB_PASS");

            // Validate that we have the required environment variables
            if (dbName == null || dbUser == null || dbPass == null) {
                throw new RuntimeException("Missing required environment variables: DB_NAME, DB_USER, DB_PASS");
            }

            // Build configuration programmatically
            Configuration configuration = new Configuration();

            // Database connection settings
            configuration.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
            configuration.setProperty("hibernate.connection.url",
                    "jdbc:mysql://database:3306/" + dbName + "?useSSL=false&serverTimezone=UTC");
            configuration.setProperty("hibernate.connection.username", dbUser);
            configuration.setProperty("hibernate.connection.password", dbPass);

            // Hibernate dialect and settings
            configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
            configuration.setProperty("hibernate.show_sql", "true");
            configuration.setProperty("hibernate.format_sql", "true");
            configuration.setProperty("hibernate.hbm2ddl.auto", "update");

            // Connection pool settings (optional but recommended)
            configuration.setProperty("hibernate.c3p0.min_size", "5");
            configuration.setProperty("hibernate.c3p0.max_size", "20");
            configuration.setProperty("hibernate.c3p0.timeout", "300");
            configuration.setProperty("hibernate.c3p0.max_statements", "50");
            configuration.setProperty("hibernate.c3p0.idle_test_period", "3000");

            // Add all entity classes
            configuration.addAnnotatedClass(User.class);
            configuration.addAnnotatedClass(Server.class);
            configuration.addAnnotatedClass(UserHasServers.class);
            configuration.addAnnotatedClass(Channel.class);
            configuration.addAnnotatedClass(TextChannelHistory.class);
            configuration.addAnnotatedClass(ServerInvitation.class);

            sessionFactory = configuration.buildSessionFactory();

            System.out.println("Hibernate SessionFactory created successfully");
            System.out.println("Database: " + dbName + ", User: " + dbUser);

        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed: " + ex.getMessage());
            ex.printStackTrace();
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
            System.out.println("Hibernate SessionFactory closed");
        }
    }
}