package com.javaweb.models.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.javaweb.enums.BookStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "book")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "pdf_Url")
    private String pdfUrl;

    @Column(name = "coverPhoto_Url")
    private String coverPhotoUrl;

    @Column(name = "publish_year")
    private Integer publishYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private List<TransactionDetail> transactionDetails = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private List<Feedback> feedbacks = new ArrayList<>();
}
