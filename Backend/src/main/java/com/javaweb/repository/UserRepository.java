package com.javaweb.repository;

import com.javaweb.models.entity.User;
import com.javaweb.enums.Role;
import com.javaweb.enums.UserStatus;
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
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<User> USER_ROW_MAPPER = (rs, rowNum) -> mapUser(rs);

    public boolean existsByPhone(String phone) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM users WHERE phone = ?",
                Integer.class,
                phone
        );
        return count != null && count > 0;
    }

    public boolean existsByUsername(String username) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM users WHERE user_name = ?",
                Integer.class,
                username
        );
        return count != null && count > 0;
    }

    public Optional<User> findByPhone(String phone) {
        List<User> result = jdbcTemplate.query(
                baseSelectSql() + " WHERE u.phone = ?",
                USER_ROW_MAPPER,
                phone
        );
        return result.stream().findFirst();
    }

    public Optional<User> findByUsername(String username) {
        List<User> result = jdbcTemplate.query(
                baseSelectSql() + " WHERE u.user_name = ?",
                USER_ROW_MAPPER,
                username
        );
        return result.stream().findFirst();
    }

    public Optional<User> findById(Integer id) {
        List<User> result = jdbcTemplate.query(
                baseSelectSql() + " WHERE u.id = ?",
                USER_ROW_MAPPER,
                id
        );
        return result.stream().findFirst();
    }

    public List<User> findAll() {
        return jdbcTemplate.query(
                baseSelectSql() + " ORDER BY u.id",
                USER_ROW_MAPPER
        );
    }

    public List<User> findAllByRole(Role role) {
        return jdbcTemplate.query(
                baseSelectSql() + " WHERE u.role = ? ORDER BY u.full_name",
                USER_ROW_MAPPER,
                role.name()
        );
    }

    public User save(User user) {
        if (user.getId() == null) {
            return insert(user);
        }
        update(user);
        return user;
    }

    private User insert(User user) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO users
                        (full_name, user_name, password, role, email, phone, address, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setCommonParameters(ps, user);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            user.setId(key.intValue());
        }
        return user;
    }

    private void update(User user) {
        jdbcTemplate.update("""
                UPDATE users
                   SET full_name = ?,
                       user_name = ?,
                       password = ?,
                       role = ?,
                       email = ?,
                       phone = ?,
                       address = ?,
                       status = ?
                 WHERE id = ?
                """, ps -> {
            setCommonParameters(ps, user);
            ps.setInt(9, user.getId());
        });
    }

    private static void setCommonParameters(PreparedStatement ps, User user) throws SQLException {
        if (user.getFullName() != null) {
            ps.setString(1, user.getFullName());
        } else {
            ps.setNull(1, Types.VARCHAR);
        }

        if (user.getUsername() != null) {
            ps.setString(2, user.getUsername());
        } else {
            ps.setNull(2, Types.VARCHAR);
        }

        if (user.getPassword() != null) {
            ps.setString(3, user.getPassword());
        } else {
            ps.setNull(3, Types.VARCHAR);
        }

        if (user.getRole() != null) {
            ps.setString(4, user.getRole().name());
        } else {
            ps.setNull(4, Types.VARCHAR);
        }

        if (user.getEmail() != null) {
            ps.setString(5, user.getEmail());
        } else {
            ps.setNull(5, Types.VARCHAR);
        }

        if (user.getPhone() != null) {
            ps.setString(6, user.getPhone());
        } else {
            ps.setNull(6, Types.VARCHAR);
        }

        if (user.getAddress() != null) {
            ps.setString(7, user.getAddress());
        } else {
            ps.setNull(7, Types.VARCHAR);
        }

        if (user.getStatus() != null) {
            ps.setString(8, user.getStatus().name());
        } else {
            ps.setNull(8, Types.VARCHAR);
        }
    }

    private static User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setFullName(rs.getString("full_name"));
        user.setUsername(rs.getString("user_name"));
        user.setPassword(rs.getString("password"));

        String roleValue = rs.getString("role");
        if (roleValue != null) {
            user.setRole(Role.valueOf(roleValue));
        }

        user.setEmail(rs.getString("email"));
        user.setPhone(rs.getString("phone"));
        user.setAddress(rs.getString("address"));

        String statusValue = rs.getString("status");
        if (statusValue != null) {
            user.setStatus(UserStatus.valueOf(statusValue));
        }

        user.setBorrowTransactionsOfReader(new ArrayList<>());
        user.setBorrowTransactionsOfStaff(new ArrayList<>());
        user.setNotificationsOfStaff(new ArrayList<>());
        user.setNotificationsOfReader(new ArrayList<>());
        user.setReviews(new ArrayList<>());

        return user;
    }

    private static String baseSelectSql() {
        return """
                SELECT u.id,
                       u.full_name,
                       u.user_name,
                       u.password,
                       u.role,
                       u.email,
                       u.phone,
                       u.address,
                       u.status
                  FROM users u
                """;
    }
}
