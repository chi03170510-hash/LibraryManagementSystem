package com.javaweb.models.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javaweb.enums.PaidStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "fine")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private BorrowTransaction transaction;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "reason", length = 255, nullable = false)
    private String reason;

    @Column(name = "issued_date")
    private LocalDateTime issuedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "paid_status")
    private PaidStatus paidStatus;

    @Column(name = "paid_date")
    private LocalDateTime paidDate;
}
