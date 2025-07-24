package com.hakimmabike.bankingbackend.securityRules;

import com.hakimmabike.bankingbackend.enums.Role;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class AuthSecurityRules implements SecurityRules{
    @Override
    public void configure(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry registry) {
        registry
                .requestMatchers(
                        // Authetication
                        "/api/auth/register",
                        "/api/auth/login",
                        "/api/auth/refresh"
                ).permitAll();
    }
}
