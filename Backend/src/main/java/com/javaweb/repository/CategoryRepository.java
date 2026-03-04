package com.javaweb.repository;

import com.javaweb.models.entity.Category;
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
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Category> CATEGORY_ROW_MAPPER = CategoryRepository::mapCategory;

    public List<Category> findAll() {
        return jdbcTemplate.query("""
                SELECT id,
                       name,
                       description
                  FROM category
                 ORDER BY name ASC
                """, CATEGORY_ROW_MAPPER);
    }

    public Optional<Category> findById(Integer id) {
        List<Category> categories = jdbcTemplate.query("""
                SELECT id,
                       name,
                       description
                  FROM category
                 WHERE id = ?
                """, CATEGORY_ROW_MAPPER, id);
        return categories.stream().findFirst();
    }

    public Category save(Category category) {
        if (category.getId() == null) {
            return insert(category);
        }
        update(category);
        return category;
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM category WHERE id = ?", id);
    }

    private Category insert(Category category) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO category (name, description)
                    VALUES (?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, category.getName());
            if (category.getDescription() != null) {
                ps.setString(2, category.getDescription());
            } else {
                ps.setNull(2, Types.VARCHAR);
            }
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            category.setId(key.intValue());
        }
        return category;
    }

    private void update(Category category) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE category
                       SET name = ?,
                           description = ?
                     WHERE id = ?
                    """);
            ps.setString(1, category.getName());
            if (category.getDescription() != null) {
                ps.setString(2, category.getDescription());
            } else {
                ps.setNull(2, Types.VARCHAR);
            }
            ps.setInt(3, category.getId());
            return ps;
        });
    }

    private static Category mapCategory(ResultSet rs, int rowNum) throws SQLException {
        return Category.builder()
                .id(rs.getInt("id"))
                .name(rs.getString("name"))
                .description(rs.getString("description"))
                .build();
    }
}
