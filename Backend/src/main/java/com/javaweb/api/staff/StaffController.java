package com.javaweb.api.staff;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.customexceptions.InvalidParamException;
import com.javaweb.dto.common.FineDTO;
import com.javaweb.dto.common.TransactionDTO;
import com.javaweb.dto.common.UserDTO;
import com.javaweb.dto.request.AuthorRequest;
import com.javaweb.dto.request.BookRequest;
import com.javaweb.dto.request.CategoryRequest;
import com.javaweb.dto.request.NotificationRequest;
import com.javaweb.dto.request.PublisherRequest;
import com.javaweb.dto.request.TransactionRequest;
import com.javaweb.dto.request.TransactionUpdateRequest;
import com.javaweb.dto.response.BookResponse;
import com.javaweb.dto.response.CategoryResponse;
import com.javaweb.dto.response.FeedbackResponse;
import com.javaweb.dto.response.PagedResponse;
import com.javaweb.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class StaffController {

    private final IBookService bookService;
    private final IAuthorService authorService;
    private final IPublisherService publisherService;
    private final ICategoryService categoryService;
    private final ITransactionService transactionService;
    private final IFeedbackService feedbackService;
    private final IUserService userService;
    private final INotificationService notificationService;
    private final IFineService fineService;

    @PostMapping(value = "/staff/books")
    public ResponseEntity<String> createBook(@RequestBody BookRequest bookRequest) throws DataNotFoundException {
        return ResponseEntity.ok(bookService.createBook(bookRequest));
    }

    @PostMapping(value = "/staff/authors")
    public ResponseEntity<String> createAuthor(@RequestBody AuthorRequest authorRequest) {
        return ResponseEntity.ok(authorService.createAuthor(authorRequest));
    }

    @PostMapping(value = "/staff/publishers")
    public ResponseEntity<String> createPublisher(@RequestBody PublisherRequest publisherRequest) {
        return ResponseEntity.ok(publisherService.createPublisher(publisherRequest));
    }

    @PutMapping(value = "/staff/books/{id}")
    public ResponseEntity<String> updateBook(@PathVariable Integer id, @RequestBody BookRequest bookRequest) throws DataNotFoundException {
        return ResponseEntity.ok(bookService.updateBook(id, bookRequest));
    }

    @PutMapping(value = "/staff/authors/{id}")
    public ResponseEntity<String> updateAuthor(@PathVariable Integer id, @RequestBody AuthorRequest authorRequest) throws DataNotFoundException {
        return ResponseEntity.ok(authorService.updateAuthor(id, authorRequest));
    }

    @PutMapping(value = "/staff/publishers/{id}")
    public ResponseEntity<String> updatePublisher(@PathVariable Integer id, @RequestBody PublisherRequest publisherRequest) throws DataNotFoundException {
        return ResponseEntity.ok(publisherService.updatePublisher(id, publisherRequest));
    }

    @DeleteMapping(value = "/staff/books/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(bookService.deleteBook(id));
    }

    @DeleteMapping(value = "/staff/authors/{id}")
    public ResponseEntity<String> deleteAuthor(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(authorService.deleteAuthor(id));
    }

    @DeleteMapping(value = "/staff/publishers/{id}")
    public ResponseEntity<String> deletePublisher(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(publisherService.deletePublisher(id));
    }

    @GetMapping(value = "/staff/books/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping(value = "/staff/categories")
    public List<CategoryResponse> getAllCategories() {
        return categoryService.findAll();
    }

    @PostMapping(value = "/staff/categories")
    public String createCategory(@RequestBody CategoryRequest categoryRequest) {
        return categoryService.createCategory(categoryRequest);
    }

    @PutMapping(value = "/staff/categories/{id}")
    public String updateCategory(@PathVariable Integer id, @RequestBody CategoryRequest categoryRequest) {
        return categoryService.updateCategory(id, categoryRequest);
    }

    @DeleteMapping(value = "/staff/categories/{id}")
    public String deleteCategory(@PathVariable Integer id) {
        return categoryService.deleteCategory(id);
    }

    @PostMapping(value = "/staff/transaction")
    public String createTransaction(@RequestBody TransactionRequest transactionRequest)
            throws DataNotFoundException, InvalidParamException {
        return transactionService.createTransaction(transactionRequest);
    }

    @GetMapping(value = "/staff/transaction/{id}")
    public TransactionDTO getTransaction(@PathVariable Integer id) throws DataNotFoundException {
        return transactionService.getTransaction(id);
    }

    @PutMapping(value = "/staff/transaction/{id}")
    public String updateTransaction(@PathVariable Integer id, @RequestBody TransactionUpdateRequest transactionUpdateRequest)
            throws DataNotFoundException, InvalidParamException {
        return transactionService.updateTransaction(id, transactionUpdateRequest);
    }

    @GetMapping(value = "/staff/transaction/overdue")
    public List<TransactionDTO> getOverdue() {
        return transactionService.getOverdue();
    }

    @GetMapping(value = "/staff/transaction/borrowed")
    public List<TransactionDTO> getBorrowingList(){
        return transactionService.getBorrowingList();
    }

    @PutMapping(value = "/staff/transaction/return/{id}")
    public String markAsReturned(@PathVariable Integer id) throws DataNotFoundException {
        return transactionService.markAsReturned(id);
    }

    @DeleteMapping(value = "/staff/transaction/{id}")
    public String deleteTransaction(@PathVariable Integer id) throws DataNotFoundException, InvalidParamException {
        return transactionService.deleteTransaction(id);
    }

    @GetMapping(value = "/staff/comment")
    public PagedResponse<FeedbackResponse> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return feedbackService.getAllFeedback(page, size);
    }

    @DeleteMapping(value = "/staff/comment/{id}")
    public  String deleteComment(@PathVariable Integer id) throws DataNotFoundException, PermissionDenyException {
        return feedbackService.deleteFeedback(id);
    }

    @GetMapping(value = "/staff/users")
    public List<UserDTO> getAllReader(){
        return userService.getAllReader();
    }

    @PutMapping(value = "/staff/users/{id}/lock")
    public String lockUserAccount(@PathVariable Integer id) throws DataNotFoundException, PermissionDenyException {
        return userService.lockUserAccount(id);
    }

    @PutMapping(value = "/staff/users/{id}/unlock")
    public ResponseEntity<String> unlockUserAccount(@PathVariable Integer id) throws DataNotFoundException, PermissionDenyException {
        return ResponseEntity.ok(userService.unlockUserAccount(id));
    }

    @PostMapping(value = "/staff/notification/send")
    public ResponseEntity<String> createNotification(@RequestBody NotificationRequest notificationRequest) throws DataNotFoundException, PermissionDenyException {
        return ResponseEntity.ok(notificationService.createNotification(notificationRequest));
    }

    @GetMapping("/staff/fines/export")
    public ResponseEntity<byte[]> exportFines() throws IOException {
        byte[] excelBytes = fineService.exportAllFines();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("fines.xlsx")
                .build());
        headers.setContentLength(excelBytes.length);
        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/staff/transactions/{transactionId}/fines")
    public ResponseEntity<List<FineDTO>> getFinesByTransaction(@PathVariable Integer transactionId) throws DataNotFoundException {
        return ResponseEntity.ok(fineService.getFineByTransactionId(transactionId));
    }

    @GetMapping("/staff/fines")
    public ResponseEntity<List<FineDTO>> getFineById() {
        return ResponseEntity.ok(fineService.getAllFine());
    }

    @PostMapping("/staff/fines")
    public ResponseEntity<String> createFine(@RequestBody FineDTO fineDTO) throws DataNotFoundException {
        return ResponseEntity.ok(fineService.createFine(fineDTO));
    }

    @PutMapping("/staff/fines/{id}")
    public ResponseEntity<String> updateFine(@PathVariable Integer id, @RequestBody FineDTO fineDTO) throws DataNotFoundException {
        return ResponseEntity.ok(fineService.updateFine(id, fineDTO));
    }

    @DeleteMapping("/staff/fines/{id}")
    public ResponseEntity<String> deleteFine(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(fineService.deleteFineById(id));
    }

    @PutMapping("/staff/fines/{id}/mark-paid")
    public ResponseEntity<String> markFineAsPaid(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(fineService.markFineAsPaid(id));
    }
}
