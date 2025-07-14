package com.hakimmabike.bankingbackend.securityRules;

import com.hakimmabike.bankingbackend.enums.Role;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class TransactionSecurityRules implements SecurityRules {
    @Override
    public void configure(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry registry) {
        registry// Allow TransactionController endpoints to be accessed by users with the USER role
                .requestMatchers("/api/transactions/**").hasAnyRole(Role.ADMIN.name(), Role.USER.name());
    }
}
