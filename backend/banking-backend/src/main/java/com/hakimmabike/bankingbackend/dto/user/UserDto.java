package com.hakimmabike.bankingbackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;


}
