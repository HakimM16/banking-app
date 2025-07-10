package com.hakimmabike.bankingbackend.dto;

import lombok.Data;

@Data
public class CreateTransactionCategoryRequest {
    private String name;
    private String description;
    private String categoryType;
    private boolean isSystem;

}
