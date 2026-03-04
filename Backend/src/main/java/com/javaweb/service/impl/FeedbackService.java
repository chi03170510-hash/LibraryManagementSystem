package com.javaweb.service.impl;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.models.entity.Feedback;
import com.javaweb.models.entity.User;
import com.javaweb.enums.Role;
import com.javaweb.dto.request.FeedbackRequest;
import com.javaweb.dto.response.FeedbackResponse;
import com.javaweb.dto.response.PagedResponse;
import com.javaweb.repository.BookRepository;
import com.javaweb.repository.FeedbackRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.security.CurrentUserProvider;
import com.javaweb.service.IFeedbackService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService implements IFeedbackService {
    private final ModelMapper modelMapper;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public String createFeedback(FeedbackRequest feedbackRequest) throws DataNotFoundException {
        Feedback feedback = modelMapper.map(feedbackRequest, Feedback.class);
        feedback.setId(null);
        User user = getRequiredCurrentUser();
        feedback.setUser(user);
        feedback.setBook(bookRepository.findById(feedbackRequest.getBookId())
                .orElseThrow(() -> new DataNotFoundException("Book not found with id " + feedbackRequest.getBookId())));
        Feedback savedFeedback = feedbackRepository.insert(feedback);
        return "Created feedback with id " + savedFeedback.getId();
    }

    @Override
    public String deleteFeedback(Integer id) throws DataNotFoundException, PermissionDenyException {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Feedback not found with id " + id));
        validateOwnership(feedback);
        feedbackRepository.deleteById(id);
        return "Deleted feedback with id " + id;
    }

    @Override
    public String updateFeedback(Integer id, String newComment) throws DataNotFoundException, PermissionDenyException {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Feedback not found with id " + id));
        validateOwnership(feedback);
        feedback.setComment(newComment);
        feedbackRepository.update(feedback);
        return "Updated feedback with id " + id;
    }

    @Override
    public PagedResponse<FeedbackResponse> getFeedbackByBookId(Integer bookId, int page, int size) throws DataNotFoundException {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new DataNotFoundException("Book not found with id " + bookId));

        int normalizedPage = Math.max(page, 0);
        int normalizedSize = size <= 0 ? 10 : Math.min(size, 100);
        long offsetLong = (long) normalizedPage * normalizedSize;
        int offset = offsetLong > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) offsetLong;

        long total = feedbackRepository.countByBookId(bookId);
        if (total == 0) {
            return new PagedResponse<>(List.of(), normalizedPage, normalizedSize, 0);
        }

        List<Feedback> feedbacks = feedbackRepository.findByBookId(bookId, normalizedSize, offset);
        User currentUser = getCurrentUserOrNull();

        List<FeedbackResponse> responses = feedbacks.stream()
                .map(feedback -> FeedbackResponse.builder()
                        .id(feedback.getId())
                        .userName(resolveUserName(feedback.getUser()))
                        .comment(feedback.getComment())
                        .owner(isOwner(currentUser, feedback))
                        .build())
                .toList();

        return new PagedResponse<>(responses, normalizedPage, normalizedSize, total);
    }

    @Override
    public PagedResponse<FeedbackResponse> getAllFeedback(int page, int size) {
        int normalizedPage = Math.max(page, 0);
        int normalizedSize = size <= 0 ? 10 : Math.min(size, 100);
        long offsetLong = (long) normalizedPage * normalizedSize;
        int offset = offsetLong > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) offsetLong;

        long total = feedbackRepository.countAll();
        if (total == 0) {
            return new PagedResponse<>(List.of(), normalizedPage, normalizedSize, 0);
        }

        List<Feedback> feedbacks = feedbackRepository.findAll(normalizedSize, offset);
        User currentUser = getCurrentUserOrNull();

        List<FeedbackResponse> responses = feedbacks.stream()
                .map(feedback -> FeedbackResponse.builder()
                        .id(feedback.getId())
                        .userName(resolveUserName(feedback.getUser()))
                        .comment(feedback.getComment())
                        .owner(isOwner(currentUser, feedback))
                        .build())
                .toList();

        return new PagedResponse<>(responses, normalizedPage, normalizedSize, total);
    }

    private String resolveUserName(User user) {
        if (user == null) {
            return "";
        }
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName();
        }
        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername();
        }
        return user.getPhone();
    }

    private void validateOwnership(Feedback feedback) throws DataNotFoundException, PermissionDenyException {
        User currentUser = getRequiredCurrentUser();
        if (currentUser.getRole() == Role.READER
                && feedback.getUser() != null
                && !feedback.getUser().getId().equals(currentUser.getId())) {
            throw new PermissionDenyException("You can only modify your own feedback.");
        }
    }

    private User getRequiredCurrentUser() throws DataNotFoundException {
        User user = getCurrentUserOrNull();
        if (user == null) {
            throw new DataNotFoundException("User not found or not authenticated");
        }
        return user;
    }

    private User getCurrentUserOrNull() {
        return currentUserProvider.getCurrentUsernameOptional()
                .flatMap(userRepository::findByUsername)
                .orElse(null);
    }

    private boolean isOwner(User currentUser, Feedback feedback) {
        if (currentUser == null || feedback == null || feedback.getUser() == null) {
            return false;
        }
        return feedback.getUser().getId().equals(currentUser.getId());
    }
}
