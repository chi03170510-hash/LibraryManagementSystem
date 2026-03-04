package com.javaweb.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer id;

    private String username;

    private String phone;

    private String email;

    private String password;

    private String address;

    private String fullName;

    @NotNull(message = "Role id is required")
    private String role;

    private String status;
}
