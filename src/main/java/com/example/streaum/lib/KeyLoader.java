package com.example.streaum.lib;

import java.security.*;
import java.security.spec.*;
import java.util.Base64;

public class KeyLoader {
    public static PrivateKey loadPrivateKeyFromEnv(String envVar) throws Exception {
        String keyBase64 = System.getenv(envVar);
        if (keyBase64 == null) throw new RuntimeException("Missing env var: " + envVar);

        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }

    public static PublicKey loadPublicKeyFromEnv(String envVar) throws Exception {
        String keyBase64 = System.getenv(envVar);
        if (keyBase64 == null) throw new RuntimeException("Missing env var: " + envVar);

        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }
}
