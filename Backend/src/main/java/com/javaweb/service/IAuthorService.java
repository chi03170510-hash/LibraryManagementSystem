package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.dto.request.AuthorRequest;
import com.javaweb.dto.response.AuthorResponse;

import java.util.List;

public interface IAuthorService {
    List<AuthorResponse> searchByName(String name);
    String createAuthor(AuthorRequest authorRequest);
    String updateAuthor(Integer id, AuthorRequest authorRequest) throws DataNotFoundException;
    String deleteAuthor(Integer id) throws DataNotFoundException;
}
