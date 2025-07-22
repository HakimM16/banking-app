package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.TransactionCategoryDto;
import com.hakimmabike.bankingbackend.dto.TransactionDto;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-22T12:14:25+0100",
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
        String transactionType = null;
        BigDecimal amount = null;
        BigDecimal balanceAfterTransaction = null;
        String description = null;
        String code = null;
        Boolean sender = null;
        Boolean receiver = null;
        String accountNumber = null;

        id = transaction.getId();
        transactionNumber = transaction.getTransactionNumber();
        transactionType = transaction.getTransactionType();
        amount = transaction.getAmount();
        if ( transaction.getBalanceAfterTransaction() != null ) {
            balanceAfterTransaction = BigDecimal.valueOf( transaction.getBalanceAfterTransaction() );
        }
        description = transaction.getDescription();
        code = transaction.getCode();
        sender = transaction.getSender();
        receiver = transaction.getReceiver();
        accountNumber = transaction.getAccountNumber();

        String categoryName = transaction.getTransactionCategory() != null ? transaction.getTransactionCategory().getName() : null;

        TransactionDto transactionDto = new TransactionDto( id, transactionNumber, transactionType, amount, balanceAfterTransaction, categoryName, description, code, sender, receiver, accountNumber );

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
        if ( transactionDto.getBalanceAfterTransaction() != null ) {
            transaction.balanceAfterTransaction( transactionDto.getBalanceAfterTransaction().doubleValue() );
        }
        transaction.description( transactionDto.getDescription() );
        transaction.code( transactionDto.getCode() );
        transaction.sender( transactionDto.getSender() );
        transaction.receiver( transactionDto.getReceiver() );
        transaction.accountNumber( transactionDto.getAccountNumber() );

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
