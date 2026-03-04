package com.javaweb.dto.response;

import com.javaweb.dto.common.TransactionDetailDTO;

public class TransactionDetailResponse extends TransactionDetailDTO {
    private String nameBook;

    public String getNameBook() {
        return nameBook;
    }

    public void setNameBook(String nameBook) {
        this.nameBook = nameBook;
    }
}
