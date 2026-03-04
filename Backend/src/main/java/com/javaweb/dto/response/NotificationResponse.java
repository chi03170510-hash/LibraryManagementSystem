package com.javaweb.dto.response;

import com.javaweb.enums.NotificationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    private Integer id;
    private String title;
    private String body;
    private NotificationStatus status;
    private LocalDateTime sentAt;
    private String senderName;
    private String recipientName;
}
