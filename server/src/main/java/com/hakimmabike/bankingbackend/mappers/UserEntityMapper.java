package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.auth.RegisterUserRequest;
import com.hakimmabike.bankingbackend.dto.user.UpdateUserRequest;
import com.hakimmabike.bankingbackend.dto.user.UserDto;
import com.hakimmabike.bankingbackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {
    UserDto toDto(User userEntity);

    User toEntity(RegisterUserRequest request);

    // Additional methods can be added here if needed
    User update(UpdateUserRequest request, @MappingTarget User userEntity);
}
