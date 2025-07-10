package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.UserStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    @NotBlank(message = "Status cannot be blank")
    private String status;
}
