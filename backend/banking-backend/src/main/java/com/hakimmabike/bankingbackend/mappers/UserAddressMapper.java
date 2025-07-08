package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.UserAddressDto;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {
    UserAddressDto toDto(UserAddress userAddress);

    UserAddress toEntity(UserAddressDto userAddressDto);

    // Additional methods can be added here if needed
}
