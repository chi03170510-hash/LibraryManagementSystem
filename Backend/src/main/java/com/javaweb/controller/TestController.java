package com.javaweb.controller;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.InvalidParamException;
import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.User;
import com.javaweb.dto.common.TransactionDTO;
import com.javaweb.dto.common.UserDTO;
import com.javaweb.dto.common.UserLoginDTO;
import com.javaweb.dto.request.TransactionRequest;
import com.javaweb.dto.response.BookResponse;
import com.javaweb.dto.response.CategoryResponse;
import com.javaweb.dto.response.PagedResponse;
import com.javaweb.repository.*;
import com.javaweb.service.IBookService;
import com.javaweb.service.ICategoryService;
import com.javaweb.service.ITransactionService;
import com.javaweb.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;


//@RestController
@RequiredArgsConstructor
public class TestController {
    private final BookRepository bookRepository;

    private final BorrowTransactionRepository borrowTransactionRepository;

    private final CategoryRepository categoryRepository;

    private final FineRepository fineRepository;

    private final PublisherRepository publisherRepository;

    private final TransactionDetailRepository transactionDetailRepository;

    private final UserRepository userRepository;

    private final AuthorRepository authorRepository;

//    @GetMapping(value = "/book")
//    public List<Book> getBook(){
//        return bookRepository.findAll();
//    }
//
//    @GetMapping(value = "/author")
//    public List<Author> getAuthor(){
//        return authorRepository.findAll();
//    }
//
    @GetMapping(value = "/borrowTransaction")
    public List<BorrowTransaction> getBorrowTransaction(){
        return borrowTransactionRepository.findAll();
    }
//
//    @GetMapping(value = "/category")
//    public List<Category> getCategory(){
//        return categoryRepository.findAll();
//    }
//
//    @GetMapping(value = "/fine")
//    public List<Fine> getFine(){
//        return fineRepository.findAll();
//    }
//
//    @GetMapping(value = "/publisher")
//    public List<Publisher> getPublisher(){
//        return publisherRepository.findAll();
//    }
//
//    @GetMapping(value = "/transactionDetail")
//    public List<TransactionDetail> getTransactionDetail(){
//        return transactionDetailRepository.findAll();
//    }
//
//    @GetMapping(value = "/User")
//    public List<User> getUser(){
//        return userRepository.findAll();
//    }

    private final IBookService bookService;

    @GetMapping(value = "/book/search")
    public PagedResponse<BookResponse> searchBook(@RequestParam Map<String, Object> request){
        return bookService.searchBooks(request);
    }

    private final ICategoryService categoryService;

    @GetMapping(value = "/categories")
    public List<CategoryResponse> getCategories(){
        return categoryService.findAll();
    }

    private final IUserService userService;

    @PostMapping(value = "/user")
    public User create(@Valid @RequestBody UserDTO userDTO) throws Exception {
        return userService.createUser(userDTO);
    }

//    @Autowired
//    private UserLoginDTO userLoginDTO;

//    Reader token: eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUkVBREVSIiwicGhvbmUiOiIwOTg3NjU0MzIxIiwic3RhdHVzIjoiQUNUSVZFIiwic3ViIjoiMDk4NzY1NDMyMSIsImV4cCI6MTc2MzEzNzExN30.XwPWUmHB0ur7qDco5aZnzX-FEQEUPmnwKRdoZOtRTbs
//    Admin/staff token: eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJwaG9uZSI6IjA5MTIzNDU2NzgiLCJzdGF0dXMiOiJBQ1RJVkUiLCJzdWIiOiIwOTEyMzQ1Njc4IiwiZXhwIjoxNzYzMTM3MzMzfQ.CEdRlBZ-5UhkRPhIhceYdjxCZsEPpImdHgEK3EvAkz4

    @GetMapping(value = "/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserLoginDTO userLoginDTO) throws Exception {
        return ResponseEntity.ok(userService.login(userLoginDTO));
    }

    @GetMapping(value = "/profile")
    public UserDTO getProfile(){
        return userService.getProfile();
    }

    @PutMapping(value = "/profile")
    public String updateProfile(@RequestBody UserDTO userDTO){
        return userService.updateProfile(userDTO);
    }

    private final ITransactionService transactionService;

    @PostMapping(value = "/transaction")
    public String createTransaction(@RequestBody TransactionRequest transactionRequest)
            throws DataNotFoundException, InvalidParamException {
        return transactionService.createTransaction(transactionRequest);
    }

    @GetMapping(value = "/transaction/{id}")
    public TransactionDTO getTransaction(@PathVariable Integer id) throws DataNotFoundException {
        return transactionService.getTransaction(id);
    }

    @GetMapping(value = "/transaction/history")
    public List<TransactionDTO> getHistory() throws DataNotFoundException{
        return transactionService.getTransactionHistory();
    }

    @GetMapping(value = "/transaction/overdue")
    public List<TransactionDTO> getOverdue(){
        return transactionService.getOverdue();
    }

    @PutMapping(value = "/transaction/return/{id}")
    public String markAsReturned(@PathVariable Integer id) throws DataNotFoundException {
        return transactionService.markAsReturned(id);
    }
}


