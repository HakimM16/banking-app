package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.transactionCategory.TransactionCategoryDto;
import com.hakimmabike.bankingbackend.dto.transaction.TransactionDto;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(target = "categoryName", expression = "java(transaction.getTransactionCategory() != null ? transaction.getTransactionCategory().getName() : null)")
    TransactionDto toDto(Transaction transaction);

    Transaction toEntity(TransactionDto transactionDto);

    TransactionCategoryDto toCategoryDto(TransactionCategory transactionCategory);
}
