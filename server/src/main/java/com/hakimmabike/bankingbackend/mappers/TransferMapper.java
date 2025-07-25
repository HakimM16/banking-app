package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.transaction.TransferDto;
import com.hakimmabike.bankingbackend.entity.Transfer;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TransferMapper {
    // Maps a Transfer entity to a TransferDto, including sender and receiver account numbers
    TransferDto toDto(Transfer transfer, String senderAccountNumber, String receiverAccountNumber);

    Transfer toEntity(TransferDto transferDto);

    // Updates an existing Transfer entity with data from the TransferDto
    void update(TransferDto transferDto, @MappingTarget Transfer transfer);
}
