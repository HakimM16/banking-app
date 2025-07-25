package com.hakimmabike.bankingbackend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private Long id;
    private String name;
    private String email;
    private String token;
}
