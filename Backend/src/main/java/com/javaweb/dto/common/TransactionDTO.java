package com.javaweb.dto.common;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDTO {
    private Integer id;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private BigDecimal fineAmount;
    private String note;
    private String status;
    private String readerName;
    private String staffName;
    private List<TransactionDetailDTO> details;
}
