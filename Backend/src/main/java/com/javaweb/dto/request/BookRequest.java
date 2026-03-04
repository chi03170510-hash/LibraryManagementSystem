package com.javaweb.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRequest {
    private Integer author_id;
    private Integer category_id;
    private Integer publish_id;
    private Integer publishYear;
    private Integer quantity;
    private String title;
    private String status;
    private String pdfUrl;
    private String coverPhotoUrl;
}
