package com.javaweb.service.impl;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.models.entity.Notification;
import com.javaweb.models.entity.User;
import com.javaweb.enums.NotificationType;
import com.javaweb.enums.Role;
import com.javaweb.dto.request.NotificationRequest;
import com.javaweb.dto.response.NotificationResponse;
import com.javaweb.repository.NotificationRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.security.CurrentUserProvider;
import com.javaweb.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final NotificationRepository notificationRepository;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public String createNotification(NotificationRequest notificationRequest) throws DataNotFoundException, PermissionDenyException {
        Notification notification = modelMapper.map(notificationRequest, Notification.class);
        notification.setRecipient(userRepository.findById(notificationRequest.getRecipientId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Recipient id " + notificationRequest.getRecipientId() + " is not found")));
        if (notification.getRecipient().getRole() != Role.READER) {
            throw new PermissionDenyException("Only reader accounts can receive notifications.");
        }
        String username = currentUserProvider.getCurrentUsername();
        notification.setSender(userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Sender username " + username + " is not found")));
        notification.markAsUnread();
        notification.setType(NotificationType.MESSAGE);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.insert(notification);
        return "Notification created successfully.";
    }

    @Override
    public List<NotificationResponse> getNotification() throws DataNotFoundException {
        String username = currentUserProvider.getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("User with username " + username + " is not found"));
        List<Notification> notifications = notificationRepository.findByRecipientId(user.getId());
        return notifications.stream()
                .map(notification -> {
                    NotificationResponse response = modelMapper.map(notification, NotificationResponse.class);
                    if (notification.getRecipient() != null) {
                        response.setRecipientName(notification.getRecipient().getFullName());
                    }
                    if (notification.getSender() != null) {
                        response.setSenderName(notification.getSender().getFullName());
                    }
                    return response;
                })
                .toList();
    }

    @Override
    public String markNotificationAsRead(Integer id) throws DataNotFoundException {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Notification id " + id + " is not found"));
        if (notification.isRead()) {
            return "Notification " + id + " was already read.";
        }
        notification.markAsRead();
        notificationRepository.update(notification);
        return "Notification " + id + " marked as read.";
    }
}
