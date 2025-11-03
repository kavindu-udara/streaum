package com.example.streaum.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import java.io.InputStream;
import java.util.Properties;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        try {
            System.out.println("=== HIBERNATE CONFIGURATION START ===");

            // Method 1: Try standard configuration first
            Configuration configuration = new Configuration();

            // Debug: Check if file exists in classpath
            InputStream configStream = HibernateUtil.class.getClassLoader()
                    .getResourceAsStream("hibernate.cfg.xml");

            if (configStream != null) {
                System.out.println("✓ hibernate.cfg.xml found in classpath");
                configStream.close();
            } else {
                System.out.println("✗ hibernate.cfg.xml NOT found in classpath");
            }

            // Configure using the XML file
            configuration.configure("hibernate.cfg.xml");

            configuration.addAnnotatedClass(com.example.streaum.entity.User.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Server.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.UserHasServers.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Channel.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.TextChannelHistory.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.ServerInvitation.class);

//
            configuration.addAnnotatedClass(com.example.streaum.entity.Profile.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Admin.class);

            // Debug: Print configuration properties
            Properties props = configuration.getProperties();
            System.out.println("Hibernate Properties:");
            props.forEach((key, value) ->
                    System.out.println("  " + key + " = " + value)
            );

            // Build ServiceRegistry
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties())
                    .build();

            // Build SessionFactory
            sessionFactory = configuration.buildSessionFactory(serviceRegistry);

            System.out.println("✓ SessionFactory created successfully");
            System.out.println("=== HIBERNATE CONFIGURATION END ===");

        } catch (Throwable ex) {
            System.err.println("❌ Initial SessionFactory creation failed: " + ex.getMessage());
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
            System.out.println("SessionFactory closed");
        }
    }

    // Alternative method for programmatic configuration
    public static SessionFactory createSessionFactoryProgrammatically() {
        try {
            Configuration configuration = new Configuration();

            // Database settings
            configuration.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
            configuration.setProperty("hibernate.connection.url", "jdbc:mysql://database:3306/streaum?useSSL=false&serverTimezone=UTC");
            configuration.setProperty("hibernate.connection.username", "myuser");
            configuration.setProperty("hibernate.connection.password", "mypassword");
            configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect");

            // Hibernate options
            configuration.setProperty("hibernate.show_sql", "true");
            configuration.setProperty("hibernate.format_sql", "true");
            configuration.setProperty("hibernate.hbm2ddl.auto", "update");
            configuration.setProperty("hibernate.connection.pool_size", "10");

            // Add entity classes
            configuration.addAnnotatedClass(com.example.streaum.entity.User.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Server.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.UserHasServers.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Channel.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.TextChannelHistory.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.ServerInvitation.class);

//
            configuration.addAnnotatedClass(com.example.streaum.entity.Profile.class);
            configuration.addAnnotatedClass(com.example.streaum.entity.Admin.class);

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties())
                    .build();

            return configuration.buildSessionFactory(serviceRegistry);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create SessionFactory programmatically", e);
        }
    }
}