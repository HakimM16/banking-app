package com.hakimmabike.bankingbackend.dto.transactionCategory;

import lombok.Data;

@Data
public class TransactionCategoryDto {
    private Long id;
    private String name;
    private String description;
    private String categoryType;
    private boolean isSystem;

}
