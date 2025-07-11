package com.hakimmabike.bankingbackend.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomiseAddressRequest {
    @NotNull(message = "Street is required")
    private String street;

    @NotNull(message = "City is required")
    private String city;

    @NotNull(message = "County is required")
    private String county;

    @NotBlank(message = "Post Code is required")
    private String postCode;

    @NotNull(message = "Country is required")
    private String country;
}
