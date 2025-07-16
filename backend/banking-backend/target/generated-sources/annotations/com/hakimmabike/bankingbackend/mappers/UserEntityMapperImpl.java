package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.RegisterUserRequest;
import com.hakimmabike.bankingbackend.dto.UpdateUserRequest;
import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.Role;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-12T23:12:54+0100",
    comments = "version: 1.6.1, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class UserEntityMapperImpl implements UserEntityMapper {

    @Override
    public UserDto toDto(User userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        Long id = null;
        String email = null;
        String firstName = null;
        String phoneNumber = null;

        id = userEntity.getId();
        email = userEntity.getEmail();
        firstName = userEntity.getFirstName();
        phoneNumber = userEntity.getPhoneNumber();

        UserDto userDto = new UserDto( id, email, firstName, phoneNumber );

        return userDto;
    }

    @Override
    public User toEntity(RegisterUserRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.password( request.getPassword() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.phoneNumber( request.getPhoneNumber() );
        if ( request.getRole() != null ) {
            user.role( Enum.valueOf( Role.class, request.getRole() ) );
        }

        return user.build();
    }

    @Override
    public User update(UpdateUserRequest request, User userEntity) {
        if ( request == null ) {
            return userEntity;
        }

        userEntity.setEmail( request.getEmail() );
        userEntity.setFirstName( request.getFirstName() );
        userEntity.setLastName( request.getLastName() );
        userEntity.setPhoneNumber( request.getPhoneNumber() );
        if ( request.getStatus() != null ) {
            userEntity.setStatus( Enum.valueOf( UserStatus.class, request.getStatus() ) );
        }
        else {
            userEntity.setStatus( null );
        }

        return userEntity;
    }
}
