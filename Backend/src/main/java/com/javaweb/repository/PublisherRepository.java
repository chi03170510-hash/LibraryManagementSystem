package com.javaweb.repository;

import com.javaweb.models.entity.Publisher;
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
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PublisherRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Publisher> PUBLISHER_ROW_MAPPER = PublisherRepository::mapPublisher;

    public List<Publisher> findAll() {
        return jdbcTemplate.query("""
                SELECT id,
                       name,
                       address,
                       phone,
                       email,
                       website,
                       founded_year,
                       description
                  FROM publisher
                 ORDER BY name ASC
                """, PUBLISHER_ROW_MAPPER);
    }

    public Optional<Publisher> findById(Integer id) {
        List<Publisher> publishers = jdbcTemplate.query("""
                SELECT id,
                       name,
                       address,
                       phone,
                       email,
                       website,
                       founded_year,
                       description
                  FROM publisher
                 WHERE id = ?
                """, PUBLISHER_ROW_MAPPER, id);
        return publishers.stream().findFirst();
    }

    public List<Publisher> searchByName(String name) {
        String keyword = name == null ? null : name.trim().toLowerCase();
        if (keyword == null || keyword.isEmpty()) {
            return findAll();
        }
        String likePattern = "%" + keyword + "%";
        return jdbcTemplate.query("""
                SELECT id,
                       name,
                       address,
                       phone,
                       email,
                       website,
                       founded_year,
                       description
                  FROM publisher
                 WHERE LOWER(name) LIKE ?
                 ORDER BY name ASC
                """, PUBLISHER_ROW_MAPPER, likePattern);
    }

    public Publisher save(Publisher publisher) {
        if (publisher.getId() == null) {
            return insert(publisher);
        }
        update(publisher);
        return publisher;
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM publisher WHERE id = ?", id);
    }

    private Publisher insert(Publisher publisher) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO publisher
                        (name, address, phone, email, website, founded_year, description)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setStatementFields(ps, publisher);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            publisher.setId(key.intValue());
        }
        return publisher;
    }

    private void update(Publisher publisher) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE publisher
                       SET name = ?,
                           address = ?,
                           phone = ?,
                           email = ?,
                           website = ?,
                           founded_year = ?,
                           description = ?
                     WHERE id = ?
                    """);
            setStatementFields(ps, publisher);
            ps.setInt(8, publisher.getId());
            return ps;
        });
    }

    private static void setStatementFields(PreparedStatement ps, Publisher publisher) throws SQLException {
        ps.setString(1, publisher.getName());
        if (publisher.getAddress() != null) {
            ps.setString(2, publisher.getAddress());
        } else {
            ps.setNull(2, Types.VARCHAR);
        }
        if (publisher.getPhone() != null) {
            ps.setString(3, publisher.getPhone());
        } else {
            ps.setNull(3, Types.VARCHAR);
        }
        if (publisher.getEmail() != null) {
            ps.setString(4, publisher.getEmail());
        } else {
            ps.setNull(4, Types.VARCHAR);
        }
        if (publisher.getWebsite() != null) {
            ps.setString(5, publisher.getWebsite());
        } else {
            ps.setNull(5, Types.VARCHAR);
        }
        if (publisher.getFoundYear() != null) {
            ps.setInt(6, publisher.getFoundYear());
        } else {
            ps.setNull(6, Types.INTEGER);
        }
        if (publisher.getDescription() != null) {
            ps.setString(7, publisher.getDescription());
        } else {
            ps.setNull(7, Types.VARCHAR);
        }
    }

    private static Publisher mapPublisher(ResultSet rs, int rowNum) throws SQLException {
        return Publisher.builder()
                .id(rs.getInt("id"))
                .name(rs.getString("name"))
                .address(rs.getString("address"))
                .phone(rs.getString("phone"))
                .email(rs.getString("email"))
                .website(rs.getString("website"))
                .foundYear(rs.getObject("founded_year", Integer.class))
                .description(rs.getString("description"))
                .build();
    }
}
