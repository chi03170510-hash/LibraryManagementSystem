package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.dto.request.BookRequest;
import com.javaweb.dto.response.BookResponse;
import com.javaweb.dto.response.PagedResponse;

import java.util.Map;

public interface IBookService {
    PagedResponse<BookResponse> searchBooks(Map<String, Object> request);
    String createBook(BookRequest bookRequest) throws DataNotFoundException;
    String updateBook(int id, BookRequest bookRequest) throws DataNotFoundException;
    String deleteBook(int id) throws DataNotFoundException;
    BookResponse getBookById(Integer id) throws DataNotFoundException;
}
