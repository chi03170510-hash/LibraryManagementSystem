package com.javaweb.repository;

import com.javaweb.models.entity.Author;
import com.javaweb.models.entity.Book;
import com.javaweb.models.entity.Category;
import com.javaweb.models.entity.Publisher;
import com.javaweb.enums.BookStatus;
import com.javaweb.dto.request.BookSearchBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Book> BOOK_ROW_MAPPER = BookRepository::mapBook;

    public List<Book> search(BookSearchBuilder searchBuilder, int limit, int offset) {
        StringBuilder sql = new StringBuilder("""
                SELECT b.*,
                       a.name AS author_name,
                       c.name AS category_name,
                       p.name AS publisher_name
                  FROM book b
                  LEFT JOIN author a ON a.id = b.author_id
                  LEFT JOIN category c ON c.id = b.category_id
                  LEFT JOIN publisher p ON p.id = b.publisher_id
                 WHERE 1 = 1
                """);

        List<Object> params = new ArrayList<>();
        List<Integer> types = new ArrayList<>();

        appendFilters(sql, params, types, searchBuilder);

        sql.append(" ORDER BY b.title ASC");

        if (limit > 0) {
            sql.append(" LIMIT ?");
            params.add(limit);
            types.add(Types.INTEGER);
        }
        if (offset > 0) {
            sql.append(" OFFSET ?");
            params.add(offset);
            types.add(Types.INTEGER);
        }

        return jdbcTemplate.query(sql.toString(),
                params.toArray(),
                types.stream().mapToInt(Integer::intValue).toArray(),
                BOOK_ROW_MAPPER);
    }

    public long count(BookSearchBuilder searchBuilder) {
        StringBuilder sql = new StringBuilder("""
                SELECT COUNT(1)
                  FROM book b
                  LEFT JOIN author a ON a.id = b.author_id
                  LEFT JOIN category c ON c.id = b.category_id
                  LEFT JOIN publisher p ON p.id = b.publisher_id
                 WHERE 1 = 1
                """);

        List<Object> params = new ArrayList<>();
        List<Integer> types = new ArrayList<>();

        appendFilters(sql, params, types, searchBuilder);

        Long total = jdbcTemplate.queryForObject(
                sql.toString(),
                params.toArray(),
                types.stream().mapToInt(Integer::intValue).toArray(),
                Long.class);
        return total != null ? total : 0L;
    }

    private static void appendFilters(StringBuilder sql,
                                      List<Object> params,
                                      List<Integer> types,
                                      BookSearchBuilder searchBuilder) {
        if (searchBuilder.getId() != null) {
            sql.append(" AND b.id = ?");
            params.add(searchBuilder.getId());
            types.add(Types.INTEGER);
        }
        if (searchBuilder.getTitle() != null && !searchBuilder.getTitle().isBlank()) {
            sql.append(" AND LOWER(b.title) LIKE ?");
            params.add("%" + searchBuilder.getTitle().trim().toLowerCase(Locale.ROOT) + "%");
            types.add(Types.VARCHAR);
        }
        if (searchBuilder.getYear() != null) {
            sql.append(" AND b.publish_year = ?");
            params.add(searchBuilder.getYear());
            types.add(Types.INTEGER);
        }
        if (searchBuilder.getAuthor() != null && !searchBuilder.getAuthor().isBlank()) {
            sql.append(" AND LOWER(a.name) LIKE ?");
            params.add("%" + searchBuilder.getAuthor().trim().toLowerCase(Locale.ROOT) + "%");
            types.add(Types.VARCHAR);
        }
        if (searchBuilder.getCategory() != null && !searchBuilder.getCategory().isBlank()) {
            sql.append(" AND LOWER(c.name) LIKE ?");
            params.add("%" + searchBuilder.getCategory().trim().toLowerCase(Locale.ROOT) + "%");
            types.add(Types.VARCHAR);
        }
    }

    public Book save(Book book) {
        if (book.getId() == null) {
            return insert(book);
        }
        update(book);
        return book;
    }

    public Optional<Book> findById(Integer id) {
        List<Book> books = jdbcTemplate.query("""
                SELECT b.*,
                       a.name AS author_name,
                       c.name AS category_name,
                       p.name AS publisher_name
                  FROM book b
                  LEFT JOIN author a ON a.id = b.author_id
                  LEFT JOIN category c ON c.id = b.category_id
                  LEFT JOIN publisher p ON p.id = b.publisher_id
                 WHERE b.id = ?
                """, BOOK_ROW_MAPPER, id);
        return books.stream().findFirst();
    }

    public boolean existsById(Integer id) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM book WHERE id = ?", Integer.class, id);
        return count != null && count > 0;
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM transaction_detail WHERE book_id = ?", id);
        jdbcTemplate.update("DELETE FROM feedback WHERE book_id = ?", id);
        jdbcTemplate.update("DELETE FROM book WHERE id = ?", id);
    }

    public void detachAuthor(Integer authorId) {
        jdbcTemplate.update("""
                UPDATE book
                   SET author_id = NULL
                 WHERE author_id = ?
                """, authorId);
    }

    public void detachPublisher(Integer publisherId) {
        jdbcTemplate.update("""
                UPDATE book
                   SET publisher_id = NULL
                 WHERE publisher_id = ?
                """, publisherId);
    }

    private Book insert(Book book) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO book
                        (title, author_id, category_id, publisher_id, quantity, pdf_url, cover_photo_url, publish_year, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setCommonParameters(ps, book);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            book.setId(key.intValue());
        }
        return book;
    }

    private void update(Book book) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE book
                       SET title = ?,
                           author_id = ?,
                           category_id = ?,
                           publisher_id = ?,
                           quantity = ?,
                           pdf_url = ?,
                           cover_photo_url = ?,
                           publish_year = ?,
                           status = ?
                     WHERE id = ?
                    """);
            setCommonParameters(ps, book);
            ps.setInt(10, book.getId());
            return ps;
        });
    }

    private static void setCommonParameters(PreparedStatement ps, Book book) throws SQLException {
        ps.setString(1, book.getTitle());

        if (book.getAuthor() != null && book.getAuthor().getId() != null) {
            ps.setInt(2, book.getAuthor().getId());
        } else {
            ps.setNull(2, Types.INTEGER);
        }

        if (book.getCategory() != null && book.getCategory().getId() != null) {
            ps.setInt(3, book.getCategory().getId());
        } else {
            ps.setNull(3, Types.INTEGER);
        }

        if (book.getPublisher() != null && book.getPublisher().getId() != null) {
            ps.setInt(4, book.getPublisher().getId());
        } else {
            ps.setNull(4, Types.INTEGER);
        }

        if (book.getQuantity() != null) {
            ps.setInt(5, book.getQuantity());
        } else {
            ps.setNull(5, Types.INTEGER);
        }

        if (book.getPdfUrl() != null) {
            ps.setString(6, book.getPdfUrl());
        } else {
            ps.setNull(6, Types.VARCHAR);
        }

        if (book.getCoverPhotoUrl() != null) {
            ps.setString(7, book.getCoverPhotoUrl());
        } else {
            ps.setNull(7, Types.VARCHAR);
        }

        if (book.getPublishYear() != null) {
            ps.setInt(8, book.getPublishYear());
        } else {
            ps.setNull(8, Types.INTEGER);
        }

        if (book.getStatus() != null) {
            ps.setString(9, book.getStatus().name());
        } else {
            ps.setNull(9, Types.VARCHAR);
        }
    }

    private static Book mapBook(ResultSet rs, int rowNum) throws SQLException {
        Integer authorId = rs.getObject("author_id", Integer.class);
        Author author = null;
        if (authorId != null) {
            author = Author.builder()
                    .id(authorId)
                    .name(rs.getString("author_name"))
                    .build();
        }

        Integer categoryId = rs.getObject("category_id", Integer.class);
        Category category = null;
        if (categoryId != null) {
            category = Category.builder()
                    .id(categoryId)
                    .name(rs.getString("category_name"))
                    .build();
        }

        Integer publisherId = rs.getObject("publisher_id", Integer.class);
        Publisher publisher = null;
        if (publisherId != null) {
            publisher = Publisher.builder()
                    .id(publisherId)
                    .name(rs.getString("publisher_name"))
                    .build();
        }

        String statusValue = getString(rs, "status");
        BookStatus status = null;
        if (statusValue != null && !statusValue.isBlank()) {
            try {
                status = BookStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException ignored) {
                status = BookStatus.AVAILABLE;
            }
        }

        return Book.builder()
                .id(rs.getInt("id"))
                .title(getString(rs, "title"))
                .author(author)
                .category(category)
                .publisher(publisher)
                .quantity(getInteger(rs, "quantity"))
                .pdfUrl(getString(rs, "pdf_url"))
                .coverPhotoUrl(getString(rs, "cover_photo_url"))
                .publishYear(getInteger(rs, "publish_year"))
                .status(status)
                .build();
    }

    private static String getString(ResultSet rs, String column) throws SQLException {
        SQLException last = null;
        for (String candidate : columnCandidates(column)) {
            try {
                return rs.getString(candidate);
            } catch (SQLException ex) {
                last = ex;
            }
        }
        throw last;
    }

    private static Integer getInteger(ResultSet rs, String column) throws SQLException {
        SQLException last = null;
        for (String candidate : columnCandidates(column)) {
            try {
                return rs.getObject(candidate, Integer.class);
            } catch (SQLException ex) {
                last = ex;
            }
        }
        throw last;
    }

    private static List<String> columnCandidates(String original) {
        List<String> candidates = new ArrayList<>();
        candidates.add(original);
        String lower = original.toLowerCase(Locale.ROOT);
        if (!candidates.contains(lower)) {
            candidates.add(lower);
        }
        String snake = original
                .replaceAll("([a-z0-9])([A-Z])", "$1_$2")
                .replaceAll("-", "_")
                .toLowerCase(Locale.ROOT);
        if (!candidates.contains(snake)) {
            candidates.add(snake);
        }
        return candidates;
    }
}
