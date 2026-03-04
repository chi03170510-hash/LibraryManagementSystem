package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.dto.request.NotificationRequest;
import com.javaweb.dto.response.NotificationResponse;

import java.util.List;

public interface INotificationService {
    String createNotification(NotificationRequest notificationRequest) throws DataNotFoundException, PermissionDenyException;
    List<NotificationResponse> getNotification() throws DataNotFoundException;
    String markNotificationAsRead(Integer id) throws DataNotFoundException;
}
