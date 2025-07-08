package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.TransactionDto;
import com.hakimmabike.bankingbackend.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionDto toDto(Transaction transaction);

    Transaction toEntity(TransactionDto transactionDto);
}
