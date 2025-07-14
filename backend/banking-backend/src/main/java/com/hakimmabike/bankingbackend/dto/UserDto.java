package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String phoneNumber;


}
