package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.InvalidParamException;
import com.javaweb.dto.common.TransactionDTO;
import com.javaweb.dto.request.TransactionRequest;
import com.javaweb.dto.request.TransactionUpdateRequest;

import java.util.List;

public interface ITransactionService {
    String createTransaction(TransactionRequest transactionRequest) throws DataNotFoundException, InvalidParamException;
    TransactionDTO getTransaction(Integer id) throws DataNotFoundException;
    List<TransactionDTO> getOverdue();
    List<TransactionDTO> getTransactionHistory() throws DataNotFoundException;
    String updateTransaction(Integer id, TransactionUpdateRequest transactionUpdateRequest) throws DataNotFoundException, InvalidParamException;
    String deleteTransaction(Integer id) throws DataNotFoundException, InvalidParamException;
    public String markAsReturned(Integer id) throws DataNotFoundException;
    void markOverdueTransactions();
    List<TransactionDTO> getBorrowingList();
}
