package com.javaweb.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublisherRequest {
    private String name;
    private String address;
    private String phone;
    private String email;
    private String website;
    private Integer foundYear;
    private String description;
}
