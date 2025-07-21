package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserAddressDto {
    private Long id;
    private String street;
    private String city;
    private String postCode;
    private String country;
    private String county;
    private Long userId; // Assuming you want to include the user ID as well



}
