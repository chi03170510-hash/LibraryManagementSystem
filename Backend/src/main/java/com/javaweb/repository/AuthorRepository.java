package com.javaweb.repository;

import com.javaweb.models.entity.Author;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Statement;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AuthorRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Author> AUTHOR_ROW_MAPPER = AuthorRepository::mapAuthor;

    public List<Author> findAll() {
        return jdbcTemplate.query("""
                SELECT id,
                       name,
                       nickname,
                       biography,
                       birth_date,
                       email
                  FROM author
                 ORDER BY name ASC
                """, AUTHOR_ROW_MAPPER);
    }

    public List<Author> findByName(String name) {
        String keyword = name == null ? null : name.trim().toLowerCase();
        if (keyword == null || keyword.isEmpty()) {
            return findAll();
        }
        String likePattern = "%" + keyword + "%";
        return jdbcTemplate.query("""
                SELECT id,
                       name,
                       nickname,
                       biography,
                       birth_date,
                       email
                  FROM author
                 WHERE LOWER(name) LIKE ?
                 ORDER BY name ASC
                """, AUTHOR_ROW_MAPPER, likePattern);
    }

    public Optional<Author> findById(Integer id) {
        List<Author> authors = jdbcTemplate.query("""
                SELECT id,
                       name,
                       nickname,
                       biography,
                       birth_date,
                       email
                 FROM author
                 WHERE id = ?
                """, AUTHOR_ROW_MAPPER, id);
        return authors.stream().findFirst();
    }

    public Author save(Author author) {
        if (author.getId() == null) {
            return insert(author);
        }
        update(author);
        return author;
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM author WHERE id = ?", id);
    }

    private Author insert(Author author) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO author (name, nickname, biography, birth_date, email)
                    VALUES (?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setStatementFields(ps, author);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            author.setId(key.intValue());
        }
        return author;
    }

    private void update(Author author) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE author
                       SET name = ?,
                           nickname = ?,
                           biography = ?,
                           birth_date = ?,
                           email = ?
                     WHERE id = ?
                    """);
            setStatementFields(ps, author);
            ps.setInt(6, author.getId());
            return ps;
        });
    }

    private static void setStatementFields(PreparedStatement ps, Author author) throws SQLException {
        ps.setString(1, author.getName());
        if (author.getNickname() != null) {
            ps.setString(2, author.getNickname());
        } else {
            ps.setNull(2, Types.VARCHAR);
        }
        if (author.getBiography() != null) {
            ps.setString(3, author.getBiography());
        } else {
            ps.setNull(3, Types.VARCHAR);
        }
        if (author.getBirthOfDate() != null) {
            ps.setTimestamp(4, Timestamp.valueOf(author.getBirthOfDate()));
        } else {
            ps.setNull(4, Types.TIMESTAMP);
        }
        if (author.getEmail() != null) {
            ps.setString(5, author.getEmail());
        } else {
            ps.setNull(5, Types.VARCHAR);
        }
    }

    private static Author mapAuthor(ResultSet rs, int rowNum) throws SQLException {
        Timestamp birthTimestamp = rs.getTimestamp("birth_date");
        LocalDateTime birthOfDate = birthTimestamp != null ? birthTimestamp.toLocalDateTime() : null;

        return Author.builder()
                .id(rs.getInt("id"))
                .name(rs.getString("name"))
                .nickname(rs.getString("nickname"))
                .biography(rs.getString("biography"))
                .birthOfDate(birthOfDate)
                .email(rs.getString("email"))
                .build();
    }
}
