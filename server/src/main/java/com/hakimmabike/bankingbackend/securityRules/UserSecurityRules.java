package com.hakimmabike.bankingbackend.securityRules;

import com.hakimmabike.bankingbackend.enums.Role;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class UserSecurityRules implements SecurityRules{
    @Override
    public void configure(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry registry) {
        registry
                // Allow users with the ADMIN or USER role to update, and get user details
                .requestMatchers(HttpMethod.PUT, "/api/user/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                .requestMatchers(HttpMethod.GET, "/api/user/{id}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                .requestMatchers(HttpMethod.GET, "/api/user/email_exists/{email}").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                // Allow users with the ADMIN or USER role to manage user addresses
                .requestMatchers(HttpMethod.POST, "/api/user/{id}/create_address").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/user/{id}/update_address").hasAnyRole(Role.ADMIN.name(), Role.USER.name())
                .requestMatchers(HttpMethod.GET, "/api/user/{id}/address").hasAnyRole(Role.ADMIN.name(), Role.USER.name());
    }
}
