package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.dto.request.FeedbackRequest;
import com.javaweb.dto.response.FeedbackResponse;
import com.javaweb.dto.response.PagedResponse;

public interface IFeedbackService {
    String createFeedback(FeedbackRequest feedbackRequest) throws DataNotFoundException;
    String deleteFeedback(Integer id) throws DataNotFoundException, PermissionDenyException;
    String updateFeedback(Integer id, String newComment) throws DataNotFoundException, PermissionDenyException;
    PagedResponse<FeedbackResponse> getFeedbackByBookId(Integer bookId, int page, int size) throws DataNotFoundException;
    PagedResponse<FeedbackResponse> getAllFeedback(int page, int size);
}
