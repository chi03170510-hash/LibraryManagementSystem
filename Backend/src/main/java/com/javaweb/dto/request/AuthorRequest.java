package com.javaweb.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthorRequest {
    private String name;
    private String nickname;
    private String biography;
    private LocalDateTime birthOfDate;
    private String email;
}
