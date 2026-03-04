package com.javaweb.dto.common;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.javaweb.enums.PaidStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FineDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer id;
    private Double amount;
    private Integer transactionId;
    private LocalDateTime issuedDate;
    private LocalDateTime paidDate;
    private String reason;
    @JsonAlias("status")
    private PaidStatus paidStatus;
}
