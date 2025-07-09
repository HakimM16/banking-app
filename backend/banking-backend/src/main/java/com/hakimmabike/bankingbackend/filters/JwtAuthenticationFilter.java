package com.hakimmabike.bankingbackend.filters;

import com.hakimmabike.bankingbackend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    /**
     * This filter intercepts incoming HTTP requests to check for a JWT token in the Authorization header.
     * If a valid token is found, it sets the authentication in the SecurityContext.
     *
     * @param request  The incoming HTTP request
     * @param response The outgoing HTTP response
     * @param filterChain The filter chain to continue processing the request
     * @throws ServletException If an error occurs during filtering
     * @throws IOException If an I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Retrieve the Authorization header from the request
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // If the Authorization header is missing or does not start with "Bearer ", continue the filter chain
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the token by removing the "Bearer " prefix
        var token = authHeader.replace("Bearer ", "");
        if (!jwtService.validateToken(token)) {
            // If the token is invalid, continue the filter chain without setting authentication
            filterChain.doFilter(request, response);
            return;
        }

        // Create an authentication object using the email extracted from the token
        var authentication = new UsernamePasswordAuthenticationToken(
                jwtService.getUserIdFromToken(token), // Extracted email from the token
                null, // No credentials are provided
                null // No authorities are provided
        );
        // Set additional details for the authentication object
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        // Set the authentication object in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
