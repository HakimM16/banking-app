package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.TransactionCategoryDto;
import com.hakimmabike.bankingbackend.dto.TransactionDto;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T08:42:19+0100",
    comments = "version: 1.6.1, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionDto toDto(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        Long id = null;
        String transactionNumber = null;
        TransactionType transactionType = null;
        BigDecimal amount = null;
        Double balanceAfterTransaction = null;
        String description = null;

        id = transaction.getId();
        transactionNumber = transaction.getTransactionNumber();
        transactionType = transaction.getTransactionType();
        amount = transaction.getAmount();
        balanceAfterTransaction = transaction.getBalanceAfterTransaction();
        description = transaction.getDescription();

        TransactionDto transactionDto = new TransactionDto( id, transactionNumber, transactionType, amount, balanceAfterTransaction, description );

        return transactionDto;
    }

    @Override
    public Transaction toEntity(TransactionDto transactionDto) {
        if ( transactionDto == null ) {
            return null;
        }

        Transaction.TransactionBuilder transaction = Transaction.builder();

        transaction.id( transactionDto.getId() );
        transaction.transactionNumber( transactionDto.getTransactionNumber() );
        transaction.transactionType( transactionDto.getTransactionType() );
        transaction.amount( transactionDto.getAmount() );
        transaction.balanceAfterTransaction( transactionDto.getBalanceAfterTransaction() );
        transaction.description( transactionDto.getDescription() );

        return transaction.build();
    }

    @Override
    public TransactionCategoryDto toCategoryDto(TransactionCategory transactionCategory) {
        if ( transactionCategory == null ) {
            return null;
        }

        TransactionCategoryDto transactionCategoryDto = new TransactionCategoryDto();

        transactionCategoryDto.setId( transactionCategory.getId() );
        transactionCategoryDto.setName( transactionCategory.getName() );
        transactionCategoryDto.setDescription( transactionCategory.getDescription() );
        if ( transactionCategory.getCategoryType() != null ) {
            transactionCategoryDto.setCategoryType( transactionCategory.getCategoryType().name() );
        }
        transactionCategoryDto.setSystem( transactionCategory.isSystem() );

        return transactionCategoryDto;
    }
}
