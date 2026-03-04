package com.javaweb.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import jakarta.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {

    @JsonProperty("username")
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password can not be blank")
    private String password;
}
