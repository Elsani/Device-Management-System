package com.devicemanagement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class DeviceManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeviceManagementApplication.class, args);
    }

    // Pastron automatikisht kufizimin e vjetër të Enum-it në PostgreSQL
    @Bean
    public CommandLineRunner cleanupConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_category_check");
            } catch (Exception ignored) {}
        };
    }
}