package com.hakimmabike.bankingbackend.config;

// In a @Configuration class
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS to all endpoints
                .allowedOrigins("http://localhost:3000", "https://banking-app-xi-wheat.vercel.app") // Allow your Next.js dev server origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Specify allowed HTTP methods
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}