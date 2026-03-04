package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.InvalidParamException;
import com.javaweb.models.entity.Book;
import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.TransactionDetail;
import com.javaweb.models.entity.User;
import com.javaweb.enums.BookStatus;
import com.javaweb.enums.BorrowTransactionStatus;
import com.javaweb.enums.Role;
import com.javaweb.enums.TransactionDetailStatus;
import com.javaweb.dto.common.TransactionDTO;
import com.javaweb.dto.common.TransactionDetailDTO;
import com.javaweb.dto.request.TransactionDetailRequest;
import com.javaweb.dto.request.TransactionRequest;
import com.javaweb.dto.request.TransactionUpdateRequest;
import com.javaweb.repository.BookRepository;
import com.javaweb.repository.BorrowTransactionRepository;
import com.javaweb.repository.FineRepository;
import com.javaweb.repository.TransactionDetailRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.security.CurrentUserProvider;
import com.javaweb.service.ITransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final BorrowTransactionRepository borrowTransactionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final TransactionDetailRepository transactionDetailRepository;
    private final FineRepository fineRepository;
    private final CurrentUserProvider currentUserProvider;

    @Override
    @Transactional
    public String createTransaction(TransactionRequest request) throws DataNotFoundException, InvalidParamException {
        BorrowTransaction transaction = new BorrowTransaction();
        transaction.setStatus(BorrowTransactionStatus.BORROWED);
        transaction.setBorrowDate(LocalDateTime.now());

        LocalDateTime dueDate = request.getDueDate() != null
                ? request.getDueDate()
                : LocalDateTime.now().plusDays(7);
        transaction.setDueDate(dueDate);
        transaction.setNote(request.getNote());

        String username = currentUserProvider.getCurrentUsername();
        transaction.setStaff(userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Staff with username " + username + " not found")));
        transaction.setReader(userRepository.findById(request.getReaderId())
                .orElseThrow(() -> new DataNotFoundException("Reader with id " + request.getReaderId() + " not found")));

        transaction = borrowTransactionRepository.save(transaction);

        for (TransactionDetailRequest detailRequest : request.getTransactionDetails()) {
            Book book = bookRepository.findById(detailRequest.getBookId())
                    .orElseThrow(() -> new DataNotFoundException("Book with id " + detailRequest.getBookId() + " not found"));

            if (book.getQuantity() <= 0) {
                throw new InvalidParamException("Book " + book.getTitle() + " is out of stock.");
            }

            book.setQuantity(book.getQuantity() - 1);
            if (book.getQuantity() == 0) {
                book.setStatus(BookStatus.UNAVAILABLE);
            }

            TransactionDetail detail = TransactionDetail.builder()
                    .book(book)
                    .transaction(transaction)
                    .conditionNote(detailRequest.getConditionNote())
                    .status(TransactionDetailStatus.BORROWED)
                    .build();
            transactionDetailRepository.insert(detail);
        }

        return MessageConstants.TRANSACTION_CREATED_SUCCESSFULLY;
    }

    @Override
    public TransactionDTO getTransaction(Integer id) throws DataNotFoundException {
        BorrowTransaction transaction = borrowTransactionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Transaction with id " + id + " not found"));
        return convertToDTO(transaction);
    }

    @Override
    public List<TransactionDTO> getOverdue() {
        List<BorrowTransaction> overdueTransactions =
                borrowTransactionRepository.findByStatus(BorrowTransactionStatus.LATE);

        return overdueTransactions.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<TransactionDTO> getBorrowingList() {
        List<BorrowTransaction> borrowing = borrowTransactionRepository.findByStatus(BorrowTransactionStatus.BORROWED);

        return borrowing.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<TransactionDTO> getTransactionHistory() throws DataNotFoundException {
        String username = currentUserProvider.getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("User not found"));

        if (user.getRole() == Role.READER) {
            List<BorrowTransaction> transactions = borrowTransactionRepository.findByReaderId(user.getId());
            return transactions.stream()
                    .map(this::convertToDTO)
                    .toList();
        }
        if (user.getRole() == Role.STAFF || user.getRole() == Role.ADMIN) {
            List<BorrowTransaction> transactions = borrowTransactionRepository.findByStaffId(user.getId());
            return transactions.stream()
                    .map(this::convertToDTO)
                    .toList();
        }
        return new ArrayList<>();
    }

    @Override
    @Transactional
    public String updateTransaction(Integer id, TransactionUpdateRequest transactionUpdateRequest) throws DataNotFoundException, InvalidParamException {
        if (transactionUpdateRequest == null) {
            throw new InvalidParamException("Transaction update request must not be null.");
        }

        BorrowTransaction transaction = borrowTransactionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Transaction with id " + id + " not found"));

        if (transactionUpdateRequest.getDueDate() != null) {
            if (transaction.getBorrowDate() != null
                    && transactionUpdateRequest.getDueDate().isBefore(transaction.getBorrowDate())) {
                throw new InvalidParamException("Due date cannot be earlier than borrow date.");
            }
            transaction.setDueDate(transactionUpdateRequest.getDueDate());
        }

        if (transactionUpdateRequest.getNote() != null) {
            String note = transactionUpdateRequest.getNote().isBlank()
                    ? null
                    : transactionUpdateRequest.getNote();
            transaction.setNote(note);
        }

        borrowTransactionRepository.save(transaction);
        return MessageConstants.TRANSACTION_UPDATED_SUCCESSFULLY;
    }

    @Override
    @Transactional
    public String deleteTransaction(Integer id) throws DataNotFoundException, InvalidParamException {
        BorrowTransaction transaction = borrowTransactionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Transaction with id " + id + " not found"));

        if (!fineRepository.findByTransactionId(id).isEmpty()) {
            throw new InvalidParamException("Cannot delete transaction while fines still reference it. Please remove fines first.");
        }

        List<TransactionDetail> details = transactionDetailRepository.findByTransactionId(id);
        if (!details.isEmpty() && transaction.getStatus() != BorrowTransactionStatus.RETURNED) {
            for (TransactionDetail detail : details) {
                Book book = bookRepository.findById(detail.getBook().getId())
                        .orElseThrow(() -> new DataNotFoundException("Book with id " + detail.getBook().getId() + " not found"));
                book.setQuantity(book.getQuantity() + 1);
                if (book.getQuantity() > 0) {
                    book.setStatus(BookStatus.AVAILABLE);
                }
            }
        }

        transactionDetailRepository.deleteByTransactionId(id);
        borrowTransactionRepository.deleteById(id);
        return MessageConstants.TRANSACTION_DELETED_SUCCESSFULLY;
    }

    @Override
    @Transactional
    public String markAsReturned(Integer id) throws DataNotFoundException {
        BorrowTransaction transaction = borrowTransactionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Transaction with id " + id + " not found"));
        if (transaction.getStatus() == BorrowTransactionStatus.RETURNED) {
            return MessageConstants.TRANSACTION_ALREADY_RETURNED;
        }

        List<TransactionDetail> details = transactionDetailRepository.findByTransactionId(transaction.getId());
        for (TransactionDetail detail : details) {
            Book book = bookRepository.findById(detail.getBook().getId())
                    .orElseThrow(() -> new DataNotFoundException("Book with id " + detail.getBook().getId() + " not found"));
            book.setQuantity(book.getQuantity() + 1);
            if (book.getQuantity() > 0) {
                book.setStatus(BookStatus.AVAILABLE);
            }
            transactionDetailRepository.updateStatus(detail.getId(), TransactionDetailStatus.RETURNED);
        }

        transaction.setStatus(BorrowTransactionStatus.RETURNED);
        transaction.setReturnDate(LocalDateTime.now());
        borrowTransactionRepository.save(transaction);

        return MessageConstants.TRANSACTION_RETURN_UPDATED_SUCCESSFULLY;
    }

    @Override
    @Transactional
    public void markOverdueTransactions() {
        LocalDateTime now = LocalDateTime.now();
        int updated = borrowTransactionRepository.markOverdueTransactionAsLate(now);

        if(updated == 0){
            log.info("Late-mark job: no overdue transactions detected");
            return;
        }

        int detailUpdated = transactionDetailRepository.markLateDetailsForLateTransactions();

        log.info("Late-mark job: {} transactions moved to LATE; {} details updated", updated, detailUpdated);
    }

    private TransactionDTO convertToDTO(BorrowTransaction transaction) {
        List<TransactionDetailDTO> detailDTOs = transactionDetailRepository.findByTransactionId(transaction.getId()).stream()
                .map(d -> new TransactionDetailDTO(
                        d.getBook() != null ? d.getBook().getTitle() : null,
                        d.getConditionNote(),
                        d.getStatus() != null ? d.getStatus().name() : null))
                .toList();

        String status = transaction.getStatus() != null ? transaction.getStatus().name() : null;
        String readerName = transaction.getReader() != null ? transaction.getReader().getFullName() : null;
        String staffName = transaction.getStaff() != null ? transaction.getStaff().getFullName() : null;

        return TransactionDTO.builder()
                .id(transaction.getId())
                .borrowDate(transaction.getBorrowDate())
                .dueDate(transaction.getDueDate())
                .returnDate(transaction.getReturnDate())
                .fineAmount(transaction.getFineAmount())
                .note(transaction.getNote())
                .status(status)
                .readerName(readerName)
                .staffName(staffName)
                .details(detailDTOs)
                .build();
    }
}
