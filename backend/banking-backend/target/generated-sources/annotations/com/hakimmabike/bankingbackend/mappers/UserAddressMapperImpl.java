package com.hakimmabike.bankingbackend.mappers;

import com.hakimmabike.bankingbackend.dto.CustomiseAddressRequest;
import com.hakimmabike.bankingbackend.dto.UserAddressDto;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-17T08:42:19+0100",
    comments = "version: 1.6.1, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class UserAddressMapperImpl implements UserAddressMapper {

    @Override
    public UserAddressDto toDto(UserAddress userAddress) {
        if ( userAddress == null ) {
            return null;
        }

        UserAddressDto.UserAddressDtoBuilder userAddressDto = UserAddressDto.builder();

        userAddressDto.id( userAddress.getId() );
        userAddressDto.street( userAddress.getStreet() );
        userAddressDto.city( userAddress.getCity() );
        userAddressDto.postCode( userAddress.getPostCode() );

        return userAddressDto.build();
    }

    @Override
    public UserAddress toEntity(CustomiseAddressRequest request) {
        if ( request == null ) {
            return null;
        }

        UserAddress.UserAddressBuilder userAddress = UserAddress.builder();

        userAddress.street( request.getStreet() );
        userAddress.city( request.getCity() );
        userAddress.county( request.getCounty() );
        userAddress.postCode( request.getPostCode() );
        userAddress.country( request.getCountry() );

        return userAddress.build();
    }

    @Override
    public UserAddress update(CustomiseAddressRequest request, UserAddress userAddress) {
        if ( request == null ) {
            return userAddress;
        }

        userAddress.setStreet( request.getStreet() );
        userAddress.setCity( request.getCity() );
        userAddress.setCounty( request.getCounty() );
        userAddress.setPostCode( request.getPostCode() );
        userAddress.setCountry( request.getCountry() );

        return userAddress;
    }
}
