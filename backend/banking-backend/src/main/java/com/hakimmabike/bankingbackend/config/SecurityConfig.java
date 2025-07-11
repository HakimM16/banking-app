package com.hakimmabike.bankingbackend.config;

import com.hakimmabike.bankingbackend.enums.Role;
import com.hakimmabike.bankingbackend.filters.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Create a DaoAuthenticationProvider to handle authentication
        var provider = new DaoAuthenticationProvider();
        // Set the password encoder to use BCrypt for hashing passwords
        provider.setPasswordEncoder(passwordEncoder());
        // Set the UserDetailsService to retrieve user details from the database
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        // Retrieve the AuthenticationManager from the provided configuration
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                // Configure session management to use stateless sessions
                .sessionManagement(c ->
                        c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Disable CSRF protection as this is a stateless API
                .csrf(AbstractHttpConfigurer::disable)
                // Configure authorization rules
                .authorizeHttpRequests(c -> c
                        // AuthController endpoints
                        // Allow unauthenticated access to the authentication endpoint
                        .requestMatchers(
                                // Authetication
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/refresh"
                        ).permitAll()
                        .requestMatchers("/api/auth/me").hasRole(Role.ADMIN.name())

                        // Allow AdminController endpoints to be accessed by users with the ADMIN role
                        .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())

                        // AccountController endpoints
                        // Allow AccountController endpoints to be accessed by users with the USER role
                        .requestMatchers(
                                "api/accounts",
                                "api/accounts/{accountId}",
                                "api/accounts/user/{userId}",
                                "api/accounts/{accountId}/balance"
                        ).permitAll()
                        // Allow users with the ADMIN role to change account status
                        .requestMatchers(HttpMethod.PATCH, "api/accounts/{accountId}/status").hasRole(Role.ADMIN.name())

                        // Allow TransactionController endpoints to be accessed by users with the USER role
                        .requestMatchers("/api/transactions/**").hasAnyRole(Role.ADMIN.name(), Role.USER.name())

                        // User Controller endpoints
                        // Allow users with the ADMIN role to update or delete users
                        .requestMatchers(HttpMethod.DELETE, "/api/user/{id}").hasRole(Role.ADMIN.name())
                        // Allow users with the ADMIN or USER role to update, and get user details
                        .requestMatchers(HttpMethod.PUT, "/api/user/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.GET, "/api/user/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        // Allow users with the ADMIN role to change user status
                        .requestMatchers(HttpMethod.PATCH, "/api/user/{id}/status").hasRole(Role.ADMIN.name())
                        // Allow users with the ADMIN or USER role to manage user addresses
                        .requestMatchers(HttpMethod.POST, "api/user/{id}/address").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.PUT, "api/user/{id}/address").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        .requestMatchers(HttpMethod.GET, "api/user/{id}/address").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                        // Require authentication for all other requests
                        .anyRequest().authenticated()
                )
                // Add the JWT authentication filter to the security filter chain
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c ->{
                    c.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    c.accessDeniedHandler(((request, response, accessDeniedException) ->
                            response.setStatus(HttpStatus.FORBIDDEN.value())));
                });
        return http.build();
    }


}
