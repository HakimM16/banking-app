package com.hakimmabike.bankingbackend.dto;

import lombok.Data;

@Data
public class CustomiseAddressRequest {
    private String street;
    private String city;
    private String county;
    private String postCode;
    private String country;
}
