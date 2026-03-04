package com.javaweb.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PublisherResponse {
    private Integer id;
    private String name;
    private String address;
    private String email;
    private String phone;
    private String website;
    private Integer foundYear;
    private String description;
}
