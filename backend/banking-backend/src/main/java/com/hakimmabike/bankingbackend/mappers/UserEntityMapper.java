package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {
    UserDto toDto(User userEntity);

    User toEntity(UserDto userDto);

    // Additional methods can be added here if needed
}
