package com.goofy.configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.database.FirebaseDatabase;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@PropertySource("classpath:application.properties")
public class FirebaseConfig {
    private final Environment env;

    public FirebaseConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public FirebaseApp createFireBaseApp() throws IOException {
        JsonObject jsonObject = JsonParser.parseString(env.getProperty("firebase.service.account")).getAsJsonObject();
        InputStream is = new ByteArrayInputStream(jsonObject.toString().getBytes());

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(is))
                .setDatabaseUrl(env.getProperty("firebase.database.url"))
                .setStorageBucket(env.getProperty("firebase.storage.url"))
                .build();

        return FirebaseApp.initializeApp(options);
    }


    @Bean
    @DependsOn(value = "createFireBaseApp")
    public StorageClient createFirebaseStorage() {
        return StorageClient.getInstance();
    }

    @Bean
    @DependsOn(value = "createFireBaseApp")
    public FirebaseAuth createFirebaseAuth() {
        return FirebaseAuth.getInstance();
    }

    @Bean
    @DependsOn(value = "createFireBaseApp")
    public FirebaseDatabase createFirebaseDatabase() {
        return FirebaseDatabase.getInstance();
    }
}
