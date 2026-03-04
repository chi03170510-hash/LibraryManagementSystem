package com.javaweb.customexceptions;

public class InvalidParamException extends Exception{
    public InvalidParamException(String message) {
        super(message);
    }
}
