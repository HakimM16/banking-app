package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private Long id;
    private String email;
    private String token;
}
