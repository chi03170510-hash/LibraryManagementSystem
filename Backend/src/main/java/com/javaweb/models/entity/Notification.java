package com.javaweb.models.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javaweb.enums.NotificationStatus;
import com.javaweb.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "notifications")
@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @Column(name = "title")
    private String title;

    @Column(name = "body")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private NotificationStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private NotificationType type;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    public void markAsRead() {
        this.status = NotificationStatus.READ;
    }

    public void markAsUnread() {
        this.status = NotificationStatus.UNREAD;
    }

    public boolean isRead() {
        return NotificationStatus.READ.equals(this.status);
    }
}
