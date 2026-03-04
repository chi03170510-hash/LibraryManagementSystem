package com.javaweb.models.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javaweb.enums.TransactionDetailStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "transaction_detail")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private BorrowTransaction transaction;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "condition_note")
    private String conditionNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TransactionDetailStatus status;
}
