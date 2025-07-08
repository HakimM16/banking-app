package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.AccountDto;
import com.hakimmabike.bankingbackend.dto.UpdateAccountRequest;
import com.hakimmabike.bankingbackend.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDto toDto(Account account);

    Account toEntity(AccountDto accountDto);

    // Additional methods can be added here for more complex mappings if needed
    Account update(@MappingTarget Account account, UpdateAccountRequest request);
}
