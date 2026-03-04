package com.javaweb.dto.common;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailDTO {
    private String bookTitle;
    private String conditionNote;
    private String status;
}
