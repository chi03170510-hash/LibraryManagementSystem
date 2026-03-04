package com.javaweb.repository;

import com.javaweb.models.entity.Book;
import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.TransactionDetail;
import com.javaweb.enums.BorrowTransactionStatus;
import com.javaweb.enums.TransactionDetailStatus;
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

@Repository
@RequiredArgsConstructor
public class TransactionDetailRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<TransactionDetail> TRANSACTION_DETAIL_ROW_MAPPER =
            (rs, rowNum) -> mapTransactionDetail(rs);

    public TransactionDetail insert(TransactionDetail detail) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO transaction_detail (transaction_id, book_id, condition_note, status)
                    VALUES (?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, detail.getTransaction().getId());
            ps.setInt(2, detail.getBook().getId());
            if (detail.getConditionNote() != null) {
                ps.setString(3, detail.getConditionNote());
            } else {
                ps.setNull(3, Types.VARCHAR);
            }
            if (detail.getStatus() != null) {
                ps.setString(4, detail.getStatus().name());
            } else {
                ps.setNull(4, Types.VARCHAR);
            }
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            detail.setId(key.intValue());
        }
        return detail;
    }

    public List<TransactionDetail> findByTransactionId(Integer transactionId) {
        return jdbcTemplate.query("""
                SELECT td.id,
                       td.transaction_id,
                       td.book_id,
                       td.condition_note,
                       td.status,
                       b.title AS book_title
                  FROM transaction_detail td
                  JOIN book b ON td.book_id = b.id
                 WHERE td.transaction_id = ?
                 ORDER BY td.id
                """, TRANSACTION_DETAIL_ROW_MAPPER, transactionId);
    }

    public void updateStatus(Integer detailId, TransactionDetailStatus status) {
        jdbcTemplate.update("""
                UPDATE transaction_detail
                   SET status = ?
                 WHERE id = ?
                """, ps -> {
            ps.setString(1, status.name());
            ps.setInt(2, detailId);
        });
    }

    public int markLateDetailsForLateTransactions() {
        return jdbcTemplate.update("""
                UPDATE transaction_detail
                   SET status = ?
                 WHERE transaction_id IN (
                       SELECT id FROM borrow_transaction WHERE status = ?
                 )
                   AND (status IS NULL OR status <> ?)
                """, ps -> {
            ps.setString(1, TransactionDetailStatus.LATE.name());
            ps.setString(2, BorrowTransactionStatus.LATE.name());
            ps.setString(3, TransactionDetailStatus.LATE.name());
        });
    }

    public void deleteByBookId(Integer bookId) {
        jdbcTemplate.update("DELETE FROM transaction_detail WHERE book_id = ?", bookId);
    }

    public void deleteByTransactionId(Integer transactionId) {
        jdbcTemplate.update("DELETE FROM transaction_detail WHERE transaction_id = ?", transactionId);
    }

    private static TransactionDetail mapTransactionDetail(ResultSet rs) throws SQLException {
        TransactionDetail detail = new TransactionDetail();
        detail.setId(rs.getInt("id"));

        Integer transactionId = rs.getObject("transaction_id", Integer.class);
        if (transactionId != null) {
            detail.setTransaction(BorrowTransaction.builder().id(transactionId).build());
        }

        Integer bookId = rs.getObject("book_id", Integer.class);
        if (bookId != null) {
            detail.setBook(Book.builder()
                    .id(bookId)
                    .title(rs.getString("book_title"))
                    .build());
        }

        detail.setConditionNote(rs.getString("condition_note"));

        String statusValue = rs.getString("status");
        if (statusValue != null) {
            detail.setStatus(TransactionDetailStatus.valueOf(statusValue));
        }

        return detail;
    }
}
