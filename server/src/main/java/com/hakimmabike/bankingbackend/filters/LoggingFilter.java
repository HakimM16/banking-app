package com.hakimmabike.bankingbackend.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class LoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Log the incoming request URL
        System.out.println("Request Method: " + request.getMethod() + ", URL: " + request.getRequestURL());

        // Continue the filter chain
        filterChain.doFilter(request, response);

        // Log the response status code
        System.out.println("Response: " + response.getStatus());
    }
}
