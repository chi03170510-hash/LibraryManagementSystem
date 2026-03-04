package com.javaweb.repository;

import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.Fine;
import com.javaweb.enums.PaidStatus;
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
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FineRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Fine> FINE_ROW_MAPPER = (rs, rowNum) -> mapFine(rs);

    public List<Fine> findAll() {
        return jdbcTemplate.query("""
                SELECT id,
                       transaction_id,
                       amount,
                       reason,
                       issued_date,
                       paid_status,
                       paid_date
                  FROM fine
                """, FINE_ROW_MAPPER);
    }

    public List<Fine> findByTransactionId(Integer transactionId) {
        return jdbcTemplate.query("""
                SELECT id,
                       transaction_id,
                       amount,
                       reason,
                       issued_date,
                       paid_status,
                       paid_date
                  FROM fine
                 WHERE transaction_id = ?
                """, FINE_ROW_MAPPER, transactionId);
    }

    public Optional<Fine> findById(Integer id) {
        List<Fine> result = jdbcTemplate.query("""
                SELECT id,
                       transaction_id,
                       amount,
                       reason,
                       issued_date,
                       paid_status,
                       paid_date
                  FROM fine
                 WHERE id = ?
                """, FINE_ROW_MAPPER, id);
        return result.stream().findFirst();
    }

    public Fine insert(Fine fine) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO fine (transaction_id, amount, reason, issued_date, paid_status, paid_date)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setCommonParameters(ps, fine);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            fine.setId(key.intValue());
        }
        return fine;
    }

    public void update(Fine fine) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE fine
                       SET transaction_id = ?,
                           amount = ?,
                           reason = ?,
                           issued_date = ?,
                           paid_status = ?,
                           paid_date = ?
                     WHERE id = ?
                    """);
            setCommonParameters(ps, fine);
            ps.setInt(7, fine.getId());
            return ps;
        });
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM fine WHERE id = ?", id);
    }

    public void deleteByTransactionId(Integer transactionId) {
        jdbcTemplate.update("DELETE FROM fine WHERE transaction_id = ?", transactionId);
    }

    private static void setCommonParameters(PreparedStatement ps, Fine fine) throws SQLException {
        Integer transactionId = fine.getTransaction() != null ? fine.getTransaction().getId() : null;
        if (transactionId != null) {
            ps.setInt(1, transactionId);
        } else {
            ps.setNull(1, Types.INTEGER);
        }

        if (fine.getAmount() != null) {
            ps.setBigDecimal(2, fine.getAmount());
        } else {
            ps.setNull(2, Types.DECIMAL);
        }

        if (fine.getReason() != null) {
            ps.setString(3, fine.getReason());
        } else {
            ps.setNull(3, Types.VARCHAR);
        }

        if (fine.getIssuedDate() != null) {
            ps.setTimestamp(4, Timestamp.valueOf(fine.getIssuedDate()));
        } else {
            ps.setNull(4, Types.TIMESTAMP);
        }

        if (fine.getPaidStatus() != null) {
            ps.setString(5, fine.getPaidStatus().name());
        } else {
            ps.setNull(5, Types.VARCHAR);
        }

        if (fine.getPaidDate() != null) {
            ps.setTimestamp(6, Timestamp.valueOf(fine.getPaidDate()));
        } else {
            ps.setNull(6, Types.TIMESTAMP);
        }
    }

    private static Fine mapFine(ResultSet rs) throws SQLException {
        Integer id = rs.getInt("id");
        Integer transactionId = rs.getObject("transaction_id", Integer.class);
        BorrowTransaction transaction = transactionId != null
                ? BorrowTransaction.builder().id(transactionId).build()
                : null;

        LocalDateTime issuedDate = null;
        Timestamp issuedTs = rs.getTimestamp("issued_date");
        if (issuedTs != null) {
            issuedDate = issuedTs.toLocalDateTime();
        }

        LocalDateTime paidDate = null;
        Timestamp paidTs = rs.getTimestamp("paid_date");
        if (paidTs != null) {
            paidDate = paidTs.toLocalDateTime();
        }

        String paidStatusValue = rs.getString("paid_status");
        PaidStatus paidStatus = paidStatusValue != null ? PaidStatus.valueOf(paidStatusValue) : null;

        return Fine.builder()
                .id(id)
                .transaction(transaction)
                .amount(rs.getBigDecimal("amount"))
                .reason(rs.getString("reason"))
                .issuedDate(issuedDate)
                .paidStatus(paidStatus)
                .paidDate(paidDate)
                .build();
    }
}
