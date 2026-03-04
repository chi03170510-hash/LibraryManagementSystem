package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.models.entity.Publisher;
import com.javaweb.dto.request.PublisherRequest;
import com.javaweb.dto.response.PublisherResponse;
import com.javaweb.repository.BookRepository;
import com.javaweb.repository.PublisherRepository;
import com.javaweb.service.IPublisherService;
import com.javaweb.service.base.AbstractNameLookupService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService extends AbstractNameLookupService<Publisher, PublisherResponse> implements IPublisherService {
    private final PublisherRepository publisherRepository;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    @Override
    protected List<Publisher> findAll() {
        return publisherRepository.findAll();
    }

    @Override
    protected List<Publisher> findByName(String name) {
        return publisherRepository.searchByName(name);
    }

    @Override
    protected PublisherResponse toResponse(Publisher entity) {
        return modelMapper.map(entity, PublisherResponse.class);
    }

    @Override
    public String createPublisher(PublisherRequest publisherRequest) {
        if (publisherRequest == null || publisherRequest.getName() == null || publisherRequest.getName().isBlank()) {
            return MessageConstants.PUBLISHER_DATA_INCOMPLETE;
        }
        Publisher publisher = modelMapper.map(publisherRequest, Publisher.class);
        publisher.setId(null);
        publisherRepository.save(publisher);
        return MessageConstants.PUBLISHER_CREATED_SUCCESSFULLY;
    }

    @Override
    public String updatePublisher(Integer id, PublisherRequest publisherRequest) throws DataNotFoundException {
        Publisher existingPublisher = publisherRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Publisher not found with id " + id));
        if (publisherRequest == null) {
            return MessageConstants.PUBLISHER_DATA_INCOMPLETE;
        }
        ModelMapper localMapper = new ModelMapper();
        localMapper.getConfiguration().setSkipNullEnabled(true);
        localMapper.map(publisherRequest, existingPublisher);
        publisherRepository.save(existingPublisher);
        return MessageConstants.PUBLISHER_UPDATED_SUCCESSFULLY;
    }

    @Override
    public String deletePublisher(Integer id) throws DataNotFoundException {
        publisherRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Publisher not found with id " + id));
        bookRepository.detachPublisher(id);
        publisherRepository.deleteById(id);
        return MessageConstants.PUBLISHER_DELETED_SUCCESSFULLY;
    }
}
