package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.TransferDto;
import com.hakimmabike.bankingbackend.entity.Transfer;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-12T23:12:54+0100",
    comments = "version: 1.6.1, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class TransferMapperImpl implements TransferMapper {

    @Override
    public TransferDto toDto(Transfer transfer, String senderAccountNumber, String receiverAccountNumber) {
        if ( transfer == null && senderAccountNumber == null && receiverAccountNumber == null ) {
            return null;
        }

        Long id = null;
        BigDecimal amount = null;
        String description = null;
        if ( transfer != null ) {
            id = transfer.getId();
            amount = transfer.getAmount();
            description = transfer.getDescription();
        }
        String senderAccountNumber1 = null;
        senderAccountNumber1 = senderAccountNumber;
        String receiverAccountNumber1 = null;
        receiverAccountNumber1 = receiverAccountNumber;

        TransferDto transferDto = new TransferDto( id, amount, description, senderAccountNumber1, receiverAccountNumber1 );

        return transferDto;
    }

    @Override
    public Transfer toEntity(TransferDto transferDto) {
        if ( transferDto == null ) {
            return null;
        }

        Transfer.TransferBuilder transfer = Transfer.builder();

        transfer.id( transferDto.getId() );
        transfer.amount( transferDto.getAmount() );
        transfer.description( transferDto.getDescription() );

        return transfer.build();
    }

    @Override
    public void update(TransferDto transferDto, Transfer transfer) {
        if ( transferDto == null ) {
            return;
        }

        transfer.setId( transferDto.getId() );
        transfer.setAmount( transferDto.getAmount() );
        transfer.setDescription( transferDto.getDescription() );
    }
}
