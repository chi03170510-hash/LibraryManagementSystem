package com.javaweb.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionRequest {
    @NotNull(message = "Reader ID must not be null")
    private Integer readerId;

    @NotNull(message = "Book list must not be null")
    private List<TransactionDetailRequest> transactionDetails;

    private String note;
    private LocalDateTime dueDate;
}
