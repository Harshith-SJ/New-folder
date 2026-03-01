package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.apache.commons.lang3.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Deep License Demo Application
 *
 * This application demonstrates how open source components can have deep licenses.
 * Deep licenses are sub-licenses or embedded licenses found in transitive dependencies.
 *
 * The dependencies in this project include:
 * - Spring Framework (Apache 2.0) - pulls in many transitive dependencies with different licenses
 * - Apache Commons Lang (Apache 2.0) - has its own license hierarchy
 * - Jackson (Apache 2.0) - multiple modules with potential deep licenses
 * - SLF4J (MIT) - logging facade with multiple implementations
 * - Logback (EPL 1.0 / LGPL 2.1) - logging implementation with dual licensing
 */
@SpringBootApplication
public class DeepLicenseDemo {

    private static final Logger logger = LoggerFactory.getLogger(DeepLicenseDemo.class);

    public static void main(String[] args) {
        SpringApplication.run(DeepLicenseDemo.class, args);
        logger.info("Deep License Demo Application Started");

        // Demonstrate usage of dependencies
        demonstrateCommonsLang();
        demonstrateJackson();
    }

    private static void demonstrateCommonsLang() {
        String text = "Hello World";
        if (StringUtils.isNotBlank(text)) {
            logger.info("Apache Commons Lang is working: {}", text);
        }
    }

    private static void demonstrateJackson() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(new Object());
            logger.info("Jackson ObjectMapper is working: {}", json);
        } catch (Exception e) {
            logger.error("Error with Jackson", e);
        }
    }
}

