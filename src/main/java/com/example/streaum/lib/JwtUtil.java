package com.example.streaum.lib;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET = System.getenv("JWT_SECRET");

//    TODO : SECRET KEY DOESNT GETTING

    public static String generateToken(Map<String, Object> claims) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET);

        var builder = JWT.create()
                .withIssuer("my-app")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600_000)); // 1h expiry

        // Add claims dynamically
        for (Map.Entry<String, Object> entry : claims.entrySet()) {
            Object value = entry.getValue();
            String key = entry.getKey();

            if (value instanceof String) {
                builder.withClaim(key, (String) value);
            } else if (value instanceof Integer) {
                builder.withClaim(key, (Integer) value);
            } else if (value instanceof Long) {
                builder.withClaim(key, (Long) value);
            } else if (value instanceof Boolean) {
                builder.withClaim(key, (Boolean) value);
            } else if (value instanceof Double) {
                builder.withClaim(key, (Double) value);
            } else {
                // fallback to string
                builder.withClaim(key, value.toString());
            }
        }

        return builder.sign(algorithm);
    }

    public static DecodedJWT verifyToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("my-app")
                .build();

        return verifier.verify(token); // throws exception if invalid
    }

}
