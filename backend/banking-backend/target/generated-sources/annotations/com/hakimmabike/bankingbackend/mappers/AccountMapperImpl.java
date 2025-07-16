package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.AccountDto;
import com.hakimmabike.bankingbackend.dto.UpdateAccountRequest;
import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import java.math.BigDecimal;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-12T23:12:54+0100",
    comments = "version: 1.6.1, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public AccountDto toDto(Account account) {
        if ( account == null ) {
            return null;
        }

        Long id = null;
        String accountNumber = null;
        String accountType = null;
        BigDecimal balance = null;
        String status = null;

        id = account.getId();
        accountNumber = account.getAccountNumber();
        if ( account.getAccountType() != null ) {
            accountType = account.getAccountType().name();
        }
        balance = account.getBalance();
        if ( account.getStatus() != null ) {
            status = account.getStatus().name();
        }

        AccountDto accountDto = new AccountDto( id, accountNumber, accountType, balance, status );

        return accountDto;
    }

    @Override
    public Account toEntity(AccountDto accountDto) {
        if ( accountDto == null ) {
            return null;
        }

        Account.AccountBuilder account = Account.builder();

        account.id( accountDto.getId() );
        account.accountNumber( accountDto.getAccountNumber() );
        if ( accountDto.getAccountType() != null ) {
            account.accountType( Enum.valueOf( AccountType.class, accountDto.getAccountType() ) );
        }
        account.balance( accountDto.getBalance() );
        if ( accountDto.getStatus() != null ) {
            account.status( Enum.valueOf( AccountStatus.class, accountDto.getStatus() ) );
        }

        return account.build();
    }

    @Override
    public Account update(Account account, UpdateAccountRequest request) {
        if ( request == null ) {
            return account;
        }

        if ( request.getAccountType() != null ) {
            account.setAccountType( Enum.valueOf( AccountType.class, request.getAccountType() ) );
        }
        else {
            account.setAccountType( null );
        }

        return account;
    }
}
