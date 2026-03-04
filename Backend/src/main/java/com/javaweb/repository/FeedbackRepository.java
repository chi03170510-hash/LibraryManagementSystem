package com.javaweb.repository;

import com.javaweb.models.entity.Book;
import com.javaweb.models.entity.Feedback;
import com.javaweb.models.entity.User;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FeedbackRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Feedback> FEEDBACK_ROW_MAPPER = FeedbackRepository::mapFeedback;

    public Feedback insert(Feedback feedback) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO feedback (comment, user_id, book_id)
                    VALUES (?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, feedback.getComment());
            ps.setInt(2, feedback.getUser().getId());
            ps.setInt(3, feedback.getBook().getId());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            feedback.setId(key.intValue());
        }
        return feedback;
    }

    public void update(Feedback feedback) {
        jdbcTemplate.update("""
                UPDATE feedback
                   SET comment = ?
                 WHERE id = ?
                """, feedback.getComment(), feedback.getId());
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM feedback WHERE id = ?", id);
    }

    public Optional<Feedback> findById(Integer id) {
        List<Feedback> feedbacks = jdbcTemplate.query("""
                SELECT f.id,
                       f.comment,
                       f.user_id,
                       u.full_name AS user_full_name,
                       u.user_name AS user_actual_username,
                       u.phone AS user_phone,
                       f.book_id,
                       b.title AS book_title
                  FROM feedback f
                  LEFT JOIN users u ON u.id = f.user_id
                  LEFT JOIN book b ON b.id = f.book_id
                 WHERE f.id = ?
                """, FEEDBACK_ROW_MAPPER, id);
        return feedbacks.stream().findFirst();
    }

    public List<Feedback> findByBookId(Integer bookId, int limit, int offset) {
        StringBuilder sql = new StringBuilder("""
                SELECT f.id,
                       f.comment,
                       f.user_id,
                       u.full_name AS user_full_name,
                       u.user_name AS user_actual_username,
                       u.phone AS user_phone,
                       f.book_id,
                       b.title AS book_title
                  FROM feedback f
                  LEFT JOIN users u ON u.id = f.user_id
                  LEFT JOIN book b ON b.id = f.book_id
                 WHERE f.book_id = ?
                 ORDER BY f.id DESC
                """);

        List<Object> params = new ArrayList<>();
        params.add(bookId);

        if (limit > 0) {
            sql.append(" LIMIT ?");
            params.add(limit);
        }
        if (offset > 0) {
            sql.append(" OFFSET ?");
            params.add(offset);
        }

        return jdbcTemplate.query(sql.toString(), params.toArray(), FEEDBACK_ROW_MAPPER);
    }

    public List<Feedback> findAll(int limit, int offset) {
        StringBuilder sql = new StringBuilder("""
                SELECT f.id,
                       f.comment,
                       f.user_id,
                       u.full_name AS user_full_name,
                       u.user_name AS user_actual_username,
                       u.phone AS user_phone,
                       f.book_id,
                       b.title AS book_title
                  FROM feedback f
                  LEFT JOIN users u ON u.id = f.user_id
                  LEFT JOIN book b ON b.id = f.book_id
                 ORDER BY f.id DESC
                """);

        List<Object> params = new ArrayList<>();
        if (limit > 0) {
            sql.append(" LIMIT ?");
            params.add(limit);
        }
        if (offset > 0) {
            sql.append(" OFFSET ?");
            params.add(offset);
        }

        return jdbcTemplate.query(sql.toString(), params.toArray(), FEEDBACK_ROW_MAPPER);
    }

    public long countByBookId(Integer bookId) {
        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM feedback WHERE book_id = ?",
                new Object[]{bookId},
                Long.class);
        return total != null ? total : 0L;
    }

    public long countAll() {
        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM feedback",
                Long.class);
        return total != null ? total : 0L;
    }

    private static Feedback mapFeedback(ResultSet rs, int rowNum) throws SQLException {
        Integer userId = rs.getObject("user_id", Integer.class);
        User user = null;
        if (userId != null) {
            user = User.builder()
                    .id(userId)
                    .fullName(rs.getString("user_full_name"))
                    .username(rs.getString("user_actual_username"))
                    .phone(rs.getString("user_phone"))
                    .build();
        }

        Integer bookId = rs.getObject("book_id", Integer.class);
        Book book = null;
        if (bookId != null) {
            book = Book.builder()
                    .id(bookId)
                    .title(rs.getString("book_title"))
                    .build();
        }

        return Feedback.builder()
                .id(rs.getInt("id"))
                .comment(rs.getString("comment"))
                .user(user)
                .book(book)
                .build();
    }
}
