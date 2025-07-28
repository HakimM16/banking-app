package com.hakimmabike.bankingbackend.securityRules;

import com.hakimmabike.bankingbackend.enums.Role;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class AccountSecurityRules implements SecurityRules {
    @Override
    public void configure(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry registry) {
        registry
                // Allow AccountController endpoints to be accessed by users with the USER role
                .requestMatchers(
                "api/accounts/{userId}",
                "api/accounts/user/{userId}",
                "api/accounts/{userId}/{accountId}/balance"
                ).permitAll()
                // Allow users with the ADMIN or USER role to delete and get accounts
                .requestMatchers(HttpMethod.GET, "api/accounts/{userId}/total-balance").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                .requestMatchers(HttpMethod.POST, "api/accounts/transaction/{userId}/deposit").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                // Allow users with the ADMIN role to change account status
                .requestMatchers(HttpMethod.PATCH, "api/accounts/{userId}/{accountId}/status").hasAnyRole(Role.ADMIN.name(), Role.USER.name());
    }
}
