package com.javaweb.api.publicweb;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.dto.common.TransactionDTO;
import com.javaweb.dto.common.UserDTO;
import com.javaweb.dto.common.UserLoginDTO;
import com.javaweb.dto.request.FeedbackRequest;
import com.javaweb.dto.response.AuthorResponse;
import com.javaweb.dto.response.BookResponse;
import com.javaweb.dto.response.NotificationResponse;
import com.javaweb.dto.response.PagedResponse;
import com.javaweb.dto.response.PublisherResponse;
import com.javaweb.dto.response.FeedbackResponse;
import com.javaweb.models.entity.User;
import com.javaweb.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
public class WebController {

    private final IUserService userService;
    private final ITransactionService transactionService;
    private final IBookService bookService;
    private final IAuthorService authorService;
    private final IPublisherService publisherService;
    private final IFeedbackService feedbackService;
    private final INotificationService notificationService;

    @PostMapping(value = "/public/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserLoginDTO userLoginDTO) throws Exception {
        return ResponseEntity.ok(userService.login(userLoginDTO));
    }

    @PostMapping(value = "/public/register")
    public User create(@Valid @RequestBody UserDTO userDTO) throws Exception {
        return userService.createUser(userDTO);
    }

    @GetMapping(value = "/profile")
    public UserDTO getProfile(){
        return userService.getProfile();
    }

    @PutMapping(value = "/profile")
    public String updateProfile(@RequestBody UserDTO userDTO){
        return userService.updateProfile(userDTO);
    }

    @GetMapping(value = "/public/books")
    public PagedResponse<BookResponse> searchBook(@RequestParam Map<String, Object> request){
        return bookService.searchBooks(request);
    }

    @GetMapping(value = "/public/books/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping(value = "/transaction/history")
    public List<TransactionDTO> getHistory() throws DataNotFoundException {
        return transactionService.getTransactionHistory();
    }

    @GetMapping(value = "/public/author")
    public List<AuthorResponse> getAuthor(@RequestParam(required = false) String name){
        return authorService.searchByName(name);
    }

    @GetMapping(value = "/public/publisher")
    public List<PublisherResponse> getPublisher(@RequestParam(required = false) String name){
        return publisherService.searchByName(name);
    }

    @PostMapping(value = "/comment")
    public String createComment(@RequestBody FeedbackRequest feedbackRequest) throws DataNotFoundException {
        return feedbackService.createFeedback(feedbackRequest);
    }

    @GetMapping(value = "/public/comment/{bookId}")
    public PagedResponse<FeedbackResponse> getFeedbackByBookId(@PathVariable Integer bookId,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size) throws DataNotFoundException{
        return feedbackService.getFeedbackByBookId(bookId, page, size);
    }

    @PutMapping(value = "/comment/{id}")
    public String updateComment(@PathVariable Integer id, @RequestBody String newComment)
            throws DataNotFoundException, PermissionDenyException {
        return feedbackService.updateFeedback(id, newComment);
    }

    @DeleteMapping(value = "/comment/{id}")
    public String deleteComment(@PathVariable Integer id) throws DataNotFoundException, PermissionDenyException {
        return feedbackService.deleteFeedback(id);
    }

    @GetMapping(value = "/notification")
    public List<NotificationResponse> getNotification() throws DataNotFoundException {
        return notificationService.getNotification();
    }

    @PutMapping(value = "/notification/{id}/read")
    public String markNotificationAsRead(@PathVariable Integer id) throws DataNotFoundException {
        return notificationService.markNotificationAsRead(id);
    }
}


