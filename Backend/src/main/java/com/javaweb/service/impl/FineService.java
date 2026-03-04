package com.javaweb.service.impl;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.models.entity.BorrowTransaction;
import com.javaweb.models.entity.Fine;
import com.javaweb.enums.PaidStatus;
import com.javaweb.dto.common.FineDTO;
import com.javaweb.repository.BorrowTransactionRepository;
import com.javaweb.repository.FineRepository;
import com.javaweb.service.IFineService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FineService implements IFineService {
    private final FineRepository fineRepository;
    private final BorrowTransactionRepository borrowTransactionRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public byte[] exportAllFines() throws IOException {
        List<Fine> fines = fineRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            XSSFSheet sheet = workbook.createSheet("Fines");
            String[] headers = {"ID", "Transaction", "Amount", "Reason", "Issued date", "Paid status"};

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Fine fine : fines) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(fine.getId());
                row.createCell(1).setCellValue(
                        Optional.ofNullable(fine.getTransaction())
                                .map(BorrowTransaction::getId)
                                .map(String::valueOf)
                                .orElse("")
                );
                row.createCell(2).setCellValue(
                        fine.getAmount() != null ? fine.getAmount().doubleValue() : 0
                );
                row.createCell(3).setCellValue(fine.getReason());
                row.createCell(4).setCellValue(
                        Optional.ofNullable(fine.getIssuedDate())
                                .map(String::valueOf)
                                .orElse("")
                );
                row.createCell(5).setCellValue(
                        Optional.ofNullable(fine.getPaidStatus())
                                .map(Enum::name)
                                .orElse("")
                );
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    @Override
    public List<FineDTO> getFineByTransactionId(Integer id) throws DataNotFoundException {
        borrowTransactionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Borrow transaction not found with id " + id));

        return fineRepository.findByTransactionId(id)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<FineDTO> getALlFine() {
        List<Fine> fines = fineRepository.findAll();
        return fines.stream().map(this::convertToDTO).toList();
    }

    @Override
    public List<FineDTO> getAllFine() {
        List<Fine> fines = fineRepository.findAll();
        return fines.stream().map(this::convertToDTO).toList();
    }

    @Override
    public String createFine(FineDTO fineDTO) throws DataNotFoundException {
        if (fineDTO == null) {
            throw new IllegalArgumentException("Fine data must not be null");
        }

        Integer transactionId = fineDTO.getTransactionId();
        if (transactionId == null) {
            throw new IllegalArgumentException("Transaction id must be provided");
        }

        BorrowTransaction transaction = borrowTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new DataNotFoundException("Borrow transaction not found with id " + transactionId));

        Fine fine = convertToEntity(fineDTO);
        fine.setId(null);
        fine.setTransaction(transaction);

        if (fine.getPaidStatus() == null) {
            fine.setPaidStatus(PaidStatus.UNPAID);
        }
        if (fine.getIssuedDate() == null) {
            fine.setIssuedDate(LocalDateTime.now());
        }
        if (fine.getPaidStatus() == PaidStatus.PAID && fine.getPaidDate() == null) {
            fine.setPaidDate(LocalDateTime.now());
        }

        Fine savedFine = fineRepository.insert(fine);
        return "Created fine with id " + savedFine.getId();
    }

    @Override
    public String updateFine(Integer id, FineDTO fineDTO) throws DataNotFoundException {
        if (fineDTO == null) {
            throw new IllegalArgumentException("Fine data must not be null");
        }

        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Fine not found with id " + id));

        if (fineDTO.getTransactionId() != null) {
            BorrowTransaction transaction = borrowTransactionRepository.findById(fineDTO.getTransactionId())
                    .orElseThrow(() -> new DataNotFoundException("Borrow transaction not found with id " + fineDTO.getTransactionId()));
            fine.setTransaction(transaction);
        }

        if (fineDTO.getAmount() != null) {
            fine.setAmount(BigDecimal.valueOf(fineDTO.getAmount()));
        }
        if (fineDTO.getReason() != null) {
            fine.setReason(fineDTO.getReason());
        }
        if (fineDTO.getIssuedDate() != null) {
            fine.setIssuedDate(fineDTO.getIssuedDate());
        }
        if (fineDTO.getPaidDate() != null) {
            fine.setPaidDate(fineDTO.getPaidDate());
        }
        if (fineDTO.getPaidStatus() != null) {
            fine.setPaidStatus(fineDTO.getPaidStatus());
        }
        if (fine.getPaidStatus() == PaidStatus.PAID && fine.getPaidDate() == null) {
            fine.setPaidDate(LocalDateTime.now());
        }

        fineRepository.update(fine);
        return "Updated fine with id " + id;
    }

    @Override
    public String deleteFineById(Integer id) throws DataNotFoundException {
        fineRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Fine not found with id " + id));
        fineRepository.deleteById(id);
        return "Deleted fine with id " + id;
    }

    @Override
    public String markFineAsPaid(Integer id) throws DataNotFoundException {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Fine not found with id " + id));

        if (fine.getPaidStatus() == PaidStatus.PAID) {
            return "Fine with id " + id + " is already marked as paid.";
        }

        fine.setPaidStatus(PaidStatus.PAID);
        fine.setPaidDate(LocalDateTime.now());
        fineRepository.update(fine);
        return "Marked fine with id " + id + " as paid.";
    }

    private FineDTO convertToDTO(Fine fine) {
        return modelMapper.map(fine, FineDTO.class);
    }

    private Fine convertToEntity(FineDTO dto) {
        return modelMapper.map(dto, Fine.class);
    }
}
