package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.AccountDto;
import com.hakimmabike.bankingbackend.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDto toDto(Account account);

    Account toEntity(AccountDto accountDto);

}
