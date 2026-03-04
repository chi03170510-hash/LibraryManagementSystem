package com.javaweb.dto.response;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedbackResponse {
    private Integer id;
    private String userName;
    private String comment;
    private boolean owner;
}
