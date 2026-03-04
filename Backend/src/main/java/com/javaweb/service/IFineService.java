package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.dto.common.FineDTO;

import java.io.IOException;
import java.util.List;

public interface IFineService {
    byte[] exportAllFines() throws IOException;
    List<FineDTO> getFineByTransactionId(Integer id) throws DataNotFoundException;
    List<FineDTO> getALlFine();

    List<FineDTO> getAllFine();

    String createFine(FineDTO fineDTO) throws DataNotFoundException;
    String updateFine(Integer id, FineDTO fineDTO) throws DataNotFoundException;
    String deleteFineById(Integer id) throws DataNotFoundException;
    String markFineAsPaid(Integer id) throws DataNotFoundException;
}
