package com.javaweb.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthorResponse {
    private Integer id;
    private String name;
    private String nickname;
    private String biography;
    private LocalDateTime birthOfDate;
    private String email;
}
