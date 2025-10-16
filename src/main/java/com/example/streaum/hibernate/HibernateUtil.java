package com.example.streaum.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import com.example.streaum.entity.*;
import java.util.concurrent.TimeUnit;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        sessionFactory = buildSessionFactoryWithRetry();
    }

    private static SessionFactory buildSessionFactoryWithRetry() {
        final int maxRetries = 30;
        final int retryDelaySeconds = 2;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                System.out.println("Attempting to connect to database (attempt " + attempt + "/" + maxRetries + ")");

                // Read environment variables
                String dbName = System.getenv("DB_NAME");
                String dbUser = System.getenv("DB_USER");
                String dbPass = System.getenv("DB_PASS");

                Configuration configuration = new Configuration();

                // Database connection settings
                configuration.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
                configuration.setProperty("hibernate.connection.url",
                        "jdbc:mysql://database:3306/" + dbName + "?useSSL=false&serverTimezone=UTC");
                configuration.setProperty("hibernate.connection.username", dbUser);
                configuration.setProperty("hibernate.connection.password", dbPass);
                configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
                configuration.setProperty("hibernate.show_sql", "true");
                configuration.setProperty("hibernate.hbm2ddl.auto", "update");

                // Add all entity classes
                configuration.addAnnotatedClass(User.class);
                configuration.addAnnotatedClass(Server.class);
                configuration.addAnnotatedClass(UserHasServers.class);
                configuration.addAnnotatedClass(Channel.class);
                configuration.addAnnotatedClass(TextChannelHistory.class);
                configuration.addAnnotatedClass(ServerInvitation.class);

                SessionFactory factory = configuration.buildSessionFactory();
                System.out.println("Database connection established successfully!");
                return factory;

            } catch (Exception e) {
                System.err.println("Database connection failed (attempt " + attempt + "/" + maxRetries + "): " + e.getMessage());

                if (attempt == maxRetries) {
                    System.err.println("Max retries reached. Could not connect to database.");
                    throw new ExceptionInInitializerError(e);
                }

                try {
                    TimeUnit.SECONDS.sleep(retryDelaySeconds);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new ExceptionInInitializerError(ie);
                }
            }
        }

        throw new ExceptionInInitializerError(new RuntimeException("Failed to connect to database after " + maxRetries + " attempts"));
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
        }
    }
}