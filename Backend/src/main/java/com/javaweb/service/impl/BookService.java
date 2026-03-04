package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.converter.BookSearchConverter;
import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.models.entity.Author;
import com.javaweb.models.entity.Book;
import com.javaweb.models.entity.Category;
import com.javaweb.models.entity.Publisher;
import com.javaweb.enums.BookStatus;
import com.javaweb.dto.request.BookRequest;
import com.javaweb.dto.request.BookSearchBuilder;
import com.javaweb.dto.response.BookResponse;
import com.javaweb.dto.response.PagedResponse;
import com.javaweb.repository.AuthorRepository;
import com.javaweb.repository.BookRepository;
import com.javaweb.repository.CategoryRepository;
import com.javaweb.repository.PublisherRepository;
import com.javaweb.service.IBookService;
import com.javaweb.utils.EntityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService {

    private final BookSearchConverter bookSearchConverter;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;

    @Override
    public PagedResponse<BookResponse> searchBooks(Map<String, Object> request) {
        BookSearchBuilder search = bookSearchConverter.toBookSearchBuilder(request);

        int page = Optional.ofNullable(search.getPage()).orElse(0);
        if (page < 0) {
            page = 0;
        }
        int size = Optional.ofNullable(search.getSize()).orElse(10);
        if (size <= 0) {
            size = 10;
        } else if (size > 100) {
            size = 100;
        }
        long offsetLong = (long) page * size;
        int offset = offsetLong > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) offsetLong;

        long total = bookRepository.count(search);
        List<BookResponse> items = total == 0
                ? List.of()
                : bookRepository.search(search, size, offset).stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(items, page, size, total);
    }

    @Override
    public String createBook(BookRequest bookRequest) throws DataNotFoundException {
        if (EntityUtils.hasNullField(bookRequest)) {
            return MessageConstants.BOOK_DATA_INCOMPLETE;
        }
        Author author = authorRepository.findById(bookRequest.getAuthor_id())
                .orElseThrow(() -> new DataNotFoundException("Author not found"));
        Publisher publisher = publisherRepository.findById(bookRequest.getPublish_id())
                .orElseThrow(() -> new DataNotFoundException("Publisher not found"));
        Category category = categoryRepository.findById(bookRequest.getCategory_id())
                .orElseThrow(() -> new DataNotFoundException("Category not found"));

        BookStatus status = parseStatus(bookRequest.getStatus());
        if (status == null) {
            status = BookStatus.AVAILABLE;
        }

        Book book = Book.builder()
                .title(bookRequest.getTitle())
                .quantity(bookRequest.getQuantity())
                .pdfUrl(bookRequest.getPdfUrl())
                .coverPhotoUrl(bookRequest.getCoverPhotoUrl())
                .publishYear(bookRequest.getPublishYear())
                .status(status)
                .author(author)
                .publisher(publisher)
                .category(category)
                .build();
        bookRepository.save(book);
        return MessageConstants.BOOK_CREATED_SUCCESSFULLY;
    }

    @Override
    public String updateBook(int id, BookRequest bookRequest) throws DataNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Book not found"));

        if (bookRequest.getTitle() != null) {
            book.setTitle(bookRequest.getTitle());
        }
        if (bookRequest.getQuantity() != null) {
            book.setQuantity(bookRequest.getQuantity());
        }
        if (bookRequest.getPdfUrl() != null) {
            book.setPdfUrl(bookRequest.getPdfUrl());
        }
        if (bookRequest.getCoverPhotoUrl() != null) {
            book.setCoverPhotoUrl(bookRequest.getCoverPhotoUrl());
        }
        if (bookRequest.getPublishYear() != null) {
            book.setPublishYear(bookRequest.getPublishYear());
        }
        if (bookRequest.getStatus() != null) {
            BookStatus status = parseStatus(bookRequest.getStatus());
            if (status != null) {
                book.setStatus(status);
            }
        }

        if (bookRequest.getAuthor_id() != null) {
            book.setAuthor(authorRepository.findById(bookRequest.getAuthor_id())
                    .orElseThrow(() -> new DataNotFoundException("Author not found")));
        }
        if (bookRequest.getPublish_id() != null) {
            book.setPublisher(publisherRepository.findById(bookRequest.getPublish_id())
                    .orElseThrow(() -> new DataNotFoundException("Publisher not found")));
        }
        if (bookRequest.getCategory_id() != null) {
            book.setCategory(categoryRepository.findById(bookRequest.getCategory_id())
                    .orElseThrow(() -> new DataNotFoundException("Category not found")));
        }

        bookRepository.save(book);
        return MessageConstants.BOOK_UPDATED_SUCCESSFULLY;
    }

    @Override
    public String deleteBook(int id) throws DataNotFoundException {
        if (!bookRepository.existsById(id)) {
            throw new DataNotFoundException("Book not found");
        }
        bookRepository.deleteById(id);
        return MessageConstants.BOOK_DELETED_SUCCESSFULLY;
    }

    @Override
    public BookResponse getBookById(Integer id) throws DataNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Book not found"));
        return toResponse(book);
    }

    private BookResponse toResponse(Book book) {
        BookResponse response = modelMapper.map(book, BookResponse.class);
        Optional.ofNullable(book.getAuthor())
                .map(Author::getName)
                .ifPresent(response::setAuthor);
        Optional.ofNullable(book.getCategory())
                .map(Category::getName)
                .ifPresent(response::setCategory);
        return response;
    }

    private BookStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return BookStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
