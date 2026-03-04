package com.javaweb.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionUpdateRequest {
    private LocalDateTime dueDate;
    private String note;
}
