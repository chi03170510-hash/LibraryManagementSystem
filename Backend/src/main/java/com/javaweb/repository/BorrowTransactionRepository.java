package com.javaweb.repository;

import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.User;
import com.javaweb.enums.BorrowTransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
public class BorrowTransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<BorrowTransaction> BORROW_TRANSACTION_ROW_MAPPER =
            (rs, rowNum) -> mapBorrowTransaction(rs);

    public BorrowTransaction save(BorrowTransaction transaction) {
        if (transaction.getId() == null) {
            return insert(transaction);
        }
        update(transaction);
        return transaction;
    }

    public Optional<BorrowTransaction> findById(Integer id) {
        List<BorrowTransaction> result = jdbcTemplate.query(buildSelectSql() + " WHERE bt.id = ?", BORROW_TRANSACTION_ROW_MAPPER, id);
        return result.stream().findFirst();
    }

    public List<BorrowTransaction> findAll() {
        return jdbcTemplate.query(buildSelectSql() + " ORDER BY bt.borrow_date DESC, bt.id DESC", BORROW_TRANSACTION_ROW_MAPPER);
    }

    public List<BorrowTransaction> findByStatus(BorrowTransactionStatus status) {
        return jdbcTemplate.query(buildSelectSql() + " WHERE bt.status = ? ORDER BY bt.borrow_date DESC, bt.id DESC",
                BORROW_TRANSACTION_ROW_MAPPER, status.name());
    }

    public List<BorrowTransaction> findByReaderId(Integer readerId) {
        return jdbcTemplate.query(buildSelectSql() + " WHERE bt.reader_id = ? ORDER BY bt.borrow_date DESC, bt.id DESC",
                BORROW_TRANSACTION_ROW_MAPPER, readerId);
    }

    public List<BorrowTransaction> findByStaffId(Integer staffId) {
        return jdbcTemplate.query(buildSelectSql() + " WHERE bt.staff_id = ? ORDER BY bt.borrow_date DESC, bt.id DESC",
                BORROW_TRANSACTION_ROW_MAPPER, staffId);
    }

    public int markOverdueTransactionAsLate(LocalDateTime now) {
        Timestamp nowTimestamp = Timestamp.valueOf(now);
        return jdbcTemplate.update("""
                UPDATE borrow_transaction
                   SET status = ?
                 WHERE status = ?
                   AND due_date < ?
                """, ps -> {
            ps.setString(1, BorrowTransactionStatus.LATE.name());
            ps.setString(2, BorrowTransactionStatus.BORROWED.name());
            ps.setTimestamp(3, nowTimestamp);
        });
    }

    private BorrowTransaction insert(BorrowTransaction transaction) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO borrow_transaction
                        (reader_id, staff_id, borrow_date, due_date, return_date, fine_amount, note, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setCommonParameters(ps, transaction);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            transaction.setId(key.intValue());
        }
        return transaction;
    }

    private void update(BorrowTransaction transaction) {
        jdbcTemplate.update("""
                UPDATE borrow_transaction
                   SET reader_id = ?,
                       staff_id = ?,
                       borrow_date = ?,
                       due_date = ?,
                       return_date = ?,
                       fine_amount = ?,
                       note = ?,
                       status = ?
                 WHERE id = ?
                """, updateSetter(transaction));
    }

    public void deleteById(Integer id) {
        jdbcTemplate.update("DELETE FROM borrow_transaction WHERE id = ?", id);
    }

    private static PreparedStatementSetter updateSetter(BorrowTransaction transaction) {
        return ps -> {
            setCommonParameters(ps, transaction);
            ps.setInt(9, transaction.getId());
        };
    }

    private static void setCommonParameters(PreparedStatement ps, BorrowTransaction transaction) throws SQLException {
        ps.setInt(1, transaction.getReader().getId());
        ps.setInt(2, transaction.getStaff().getId());

        LocalDateTime borrowDate = transaction.getBorrowDate();
        if (borrowDate != null) {
            ps.setTimestamp(3, Timestamp.valueOf(borrowDate));
        } else {
            ps.setNull(3, Types.TIMESTAMP);
        }

        LocalDateTime dueDate = transaction.getDueDate();
        if (dueDate != null) {
            ps.setTimestamp(4, Timestamp.valueOf(dueDate));
        } else {
            ps.setNull(4, Types.TIMESTAMP);
        }

        if (transaction.getReturnDate() != null) {
            ps.setTimestamp(5, Timestamp.valueOf(transaction.getReturnDate()));
        } else {
            ps.setNull(5, Types.TIMESTAMP);
        }
        BigDecimal fineAmount = transaction.getFineAmount();
        if (fineAmount != null) {
            ps.setBigDecimal(6, fineAmount);
        } else {
            ps.setNull(6, Types.DECIMAL);
        }
        if (transaction.getNote() != null) {
            ps.setString(7, transaction.getNote());
        } else {
            ps.setNull(7, Types.VARCHAR);
        }
        if (transaction.getStatus() != null) {
            ps.setString(8, transaction.getStatus().name());
        } else {
            ps.setNull(8, Types.VARCHAR);
        }
    }

    private static BorrowTransaction mapBorrowTransaction(ResultSet rs) throws SQLException {
        BorrowTransaction transaction = new BorrowTransaction();
        transaction.setId(rs.getInt("id"));

        Integer readerId = rs.getObject("reader_id", Integer.class);
        if (readerId != null) {
            User reader = User.builder()
                    .id(readerId)
                    .fullName(rs.getString("reader_full_name"))
                    .build();
            transaction.setReader(reader);
        }

        Integer staffId = rs.getObject("staff_id", Integer.class);
        if (staffId != null) {
            User staff = User.builder()
                    .id(staffId)
                    .fullName(rs.getString("staff_full_name"))
                    .build();
            transaction.setStaff(staff);
        }

        transaction.setBorrowDate(toLocalDateTime(rs.getTimestamp("borrow_date")));
        transaction.setDueDate(toLocalDateTime(rs.getTimestamp("due_date")));
        transaction.setReturnDate(toLocalDateTime(rs.getTimestamp("return_date")));
        transaction.setFineAmount(rs.getBigDecimal("fine_amount"));
        transaction.setNote(rs.getString("note"));

        String statusValue = rs.getString("status");
        if (statusValue != null) {
            transaction.setStatus(BorrowTransactionStatus.valueOf(statusValue));
        }

        return transaction;
    }

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }

    private static String buildSelectSql() {
        return """
                SELECT bt.id,
                       bt.reader_id,
                       reader.full_name AS reader_full_name,
                       bt.staff_id,
                       staff.full_name AS staff_full_name,
                       bt.borrow_date,
                       bt.due_date,
                       bt.return_date,
                       bt.fine_amount,
                       bt.note,
                       bt.status
                  FROM borrow_transaction bt
                  JOIN users reader ON bt.reader_id = reader.id
                  JOIN users staff ON bt.staff_id = staff.id
                """;
    }
}
