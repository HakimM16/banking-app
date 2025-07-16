package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.CustomiseAddressRequest;
import com.hakimmabike.bankingbackend.dto.UserAddressDto;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {
    UserAddressDto toDto(UserAddress userAddress);

    UserAddress toEntity(CustomiseAddressRequest request);

    // Additional methods can be added here if needed
    UserAddress update(CustomiseAddressRequest request, @MappingTarget UserAddress userAddress);
}
