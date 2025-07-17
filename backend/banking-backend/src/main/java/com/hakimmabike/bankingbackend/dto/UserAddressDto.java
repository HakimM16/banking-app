package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class UserAddressDto {
    private Long id;
    private String street;
    private String city;
    private String postCode;
    private String country;
    private Long userId; // Assuming you want to include the user ID as well
}
