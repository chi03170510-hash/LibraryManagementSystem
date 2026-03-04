package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.dto.request.PublisherRequest;
import com.javaweb.dto.response.PublisherResponse;

import java.util.List;

public interface IPublisherService {
    List<PublisherResponse> searchByName(String name);
    String createPublisher(PublisherRequest publisherRequest);
    String updatePublisher(Integer id, PublisherRequest publisherRequest) throws DataNotFoundException;
    String deletePublisher(Integer id) throws DataNotFoundException;
}
