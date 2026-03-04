package com.javaweb.config;

import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.Fine;
import com.javaweb.models.entity.User;
import com.javaweb.dto.common.FineDTO;
import com.javaweb.dto.common.UserDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.Converter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.typeMap(UserDTO.class, User.class)
                .addMappings(m -> m.skip(User::setId));

        Converter<Double, java.math.BigDecimal> doubleToBigDecimal =
                context -> context.getSource() == null ? null : java.math.BigDecimal.valueOf(context.getSource());
        Converter<java.math.BigDecimal, Double> bigDecimalToDouble =
                context -> context.getSource() == null ? null : context.getSource().doubleValue();
        Converter<Integer, BorrowTransaction> idToBorrowTransaction =
                context -> context.getSource() == null ? null : BorrowTransaction.builder().id(context.getSource()).build();
        Converter<BorrowTransaction, Integer> borrowTransactionToId =
                context -> context.getSource() == null ? null : context.getSource().getId();

        mapper.typeMap(Fine.class, FineDTO.class)
                .addMappings(m -> {
                    m.using(bigDecimalToDouble).map(Fine::getAmount, FineDTO::setAmount);
                    m.using(borrowTransactionToId).map(Fine::getTransaction, FineDTO::setTransactionId);
                });

        mapper.typeMap(FineDTO.class, Fine.class)
                .addMappings(m -> {
                    m.using(doubleToBigDecimal).map(FineDTO::getAmount, Fine::setAmount);
                    // leave transaction unset; service will load BorrowTransaction entity
                });
        return mapper;
    }
}
