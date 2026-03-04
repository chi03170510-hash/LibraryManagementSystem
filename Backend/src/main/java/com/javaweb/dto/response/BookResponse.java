package com.javaweb.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookResponse {
    private Integer id;
    private int quantity;
    private String title;
    private String status;
    private int publishYear;
    private String category;
    private String author;
    private String pdfUrl;
    private String coverPhotoUrl;
}
