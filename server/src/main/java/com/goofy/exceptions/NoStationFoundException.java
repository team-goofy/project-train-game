package com.goofy.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoStationFoundException extends RuntimeException {
    public NoStationFoundException(String errMsg) {
        super(errMsg);
    }
}
