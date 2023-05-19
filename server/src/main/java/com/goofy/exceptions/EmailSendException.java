package com.goofy.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class EmailSendException extends RuntimeException {
    public EmailSendException(String errMsg) {
        super(errMsg);
    }
}
