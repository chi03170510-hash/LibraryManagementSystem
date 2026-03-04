package com.javaweb.repository;

import com.javaweb.models.entity.Notification;
import com.javaweb.models.entity.User;
import com.javaweb.enums.NotificationStatus;
import com.javaweb.enums.NotificationType;
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
import java.util.Locale;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Notification> NOTIFICATION_ROW_MAPPER = NotificationRepository::mapNotification;

    public Notification insert(Notification notification) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO notifications
                        (sender_id, recipient_id, title, body, status, type, sent_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            setCommonParameters(ps, notification);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key != null) {
            notification.setId(key.intValue());
        }
        return notification;
    }

    public void update(Notification notification) {
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    UPDATE notifications
                       SET sender_id = ?,
                           recipient_id = ?,
                           title = ?,
                           body = ?,
                           status = ?,
                           type = ?,
                           sent_at = ?
                     WHERE id = ?
                    """);
            setCommonParameters(ps, notification);
            ps.setInt(8, notification.getId());
            return ps;
        });
    }

    public Optional<Notification> findById(Integer id) {
        List<Notification> notifications = jdbcTemplate.query("""
                SELECT n.id,
                       n.sender_id,
                       sender.full_name AS sender_full_name,
                       n.recipient_id,
                       recipient.full_name AS recipient_full_name,
                       n.title,
                       n.body,
                       n.status,
                       n.type,
                       n.sent_at
                  FROM notifications n
                  LEFT JOIN users sender ON sender.id = n.sender_id
                  LEFT JOIN users recipient ON recipient.id = n.recipient_id
                 WHERE n.id = ?
                """, NOTIFICATION_ROW_MAPPER, id);
        return notifications.stream().findFirst();
    }

    public List<Notification> findByRecipientId(Integer recipientId) {
        return jdbcTemplate.query("""
                SELECT n.id,
                       n.sender_id,
                       sender.full_name AS sender_full_name,
                       n.recipient_id,
                       recipient.full_name AS recipient_full_name,
                       n.title,
                       n.body,
                       n.status,
                       n.type,
                       n.sent_at
                  FROM notifications n
                  LEFT JOIN users sender ON sender.id = n.sender_id
                  LEFT JOIN users recipient ON recipient.id = n.recipient_id
                 WHERE n.recipient_id = ?
                 ORDER BY n.sent_at DESC
                """, NOTIFICATION_ROW_MAPPER, recipientId);
    }

    private static void setCommonParameters(PreparedStatement ps, Notification notification) throws SQLException {
        Integer senderId = notification.getSender() != null ? notification.getSender().getId() : null;
        Integer recipientId = notification.getRecipient() != null ? notification.getRecipient().getId() : null;

        if (senderId != null) {
            ps.setInt(1, senderId);
        } else {
            ps.setNull(1, Types.INTEGER);
        }

        if (recipientId != null) {
            ps.setInt(2, recipientId);
        } else {
            ps.setNull(2, Types.INTEGER);
        }

        ps.setString(3, notification.getTitle());
        ps.setString(4, notification.getBody());

        NotificationStatus status = notification.getStatus() != null
                ? notification.getStatus()
                : NotificationStatus.UNREAD;
        ps.setString(5, status.name());

        NotificationType type = notification.getType() != null
                ? notification.getType()
                : NotificationType.MESSAGE;
        ps.setString(6, type.name());

        LocalDateTime sentAt = notification.getSentAt();
        if (sentAt != null) {
            ps.setTimestamp(7, Timestamp.valueOf(sentAt));
        } else {
            ps.setNull(7, Types.TIMESTAMP);
        }
    }

    private static Notification mapNotification(ResultSet rs, int rowNum) throws SQLException {
        Integer senderId = rs.getObject("sender_id", Integer.class);
        Integer recipientId = rs.getObject("recipient_id", Integer.class);

        User sender = null;
        if (senderId != null) {
            sender = User.builder()
                    .id(senderId)
                    .fullName(rs.getString("sender_full_name"))
                    .build();
        }

        User recipient = null;
        if (recipientId != null) {
            recipient = User.builder()
                    .id(recipientId)
                    .fullName(rs.getString("recipient_full_name"))
                    .build();
        }

        Timestamp sentTimestamp = rs.getTimestamp("sent_at");
        LocalDateTime sentAt = sentTimestamp != null ? sentTimestamp.toLocalDateTime() : null;

        String statusValue = rs.getString("status");
        NotificationStatus status = null;
        if (statusValue != null && !statusValue.isBlank()) {
            try {
                status = NotificationStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException ignored) {
                status = NotificationStatus.UNREAD;
            }
        } else {
            status = NotificationStatus.UNREAD;
        }

        String typeValue = rs.getString("type");
        NotificationType type = null;
        if (typeValue != null && !typeValue.isBlank()) {
            try {
                type = NotificationType.valueOf(typeValue.trim().toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException ignored) {
                type = NotificationType.MESSAGE;
            }
        } else {
            type = NotificationType.MESSAGE;
        }

        return Notification.builder()
                .id(rs.getInt("id"))
                .sender(sender)
                .recipient(recipient)
                .title(rs.getString("title"))
                .body(rs.getString("body"))
                .status(status)
                .type(type)
                .sentAt(sentAt)
                .build();
    }
}
