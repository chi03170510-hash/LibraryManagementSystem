package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.models.entity.Author;
import com.javaweb.dto.request.AuthorRequest;
import com.javaweb.dto.response.AuthorResponse;
import com.javaweb.repository.AuthorRepository;
import com.javaweb.repository.BookRepository;
import com.javaweb.service.IAuthorService;
import com.javaweb.service.base.AbstractNameLookupService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService extends AbstractNameLookupService<Author, AuthorResponse> implements IAuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    @Override
    protected List<Author> findAll() {
        return authorRepository.findAll();
    }

    @Override
    protected List<Author> findByName(String name) {
        return authorRepository.findByName(name);
    }

    @Override
    protected AuthorResponse toResponse(Author entity) {
        return modelMapper.map(entity, AuthorResponse.class);
    }

    @Override
    public String createAuthor(AuthorRequest authorRequest) {
        if (authorRequest == null || authorRequest.getName() == null || authorRequest.getName().isBlank()) {
            return MessageConstants.AUTHOR_DATA_INCOMPLETE;
        }
        Author author = modelMapper.map(authorRequest, Author.class);
        author.setId(null);
        authorRepository.save(author);
        return MessageConstants.AUTHOR_CREATED_SUCCESSFULLY;
    }

    @Override
    public String updateAuthor(Integer id, AuthorRequest authorRequest) throws DataNotFoundException {
        Author existingAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Author not found with id " + id));
        if (authorRequest == null) {
            return MessageConstants.AUTHOR_DATA_INCOMPLETE;
        }
        ModelMapper localMapper = new ModelMapper();
        localMapper.getConfiguration().setSkipNullEnabled(true);
        localMapper.map(authorRequest, existingAuthor);
        authorRepository.save(existingAuthor);
        return MessageConstants.AUTHOR_UPDATED_SUCCESSFULLY;
    }

    @Override
    public String deleteAuthor(Integer id) throws DataNotFoundException {
        authorRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Author not found with id " + id));
        bookRepository.detachAuthor(id);
        authorRepository.deleteById(id);
        return MessageConstants.AUTHOR_DELETED_SUCCESSFULLY;
    }
}
