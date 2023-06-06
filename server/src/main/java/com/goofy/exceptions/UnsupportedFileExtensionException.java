package com.goofy.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class UnsupportedFileExtensionException extends RuntimeException {
    public UnsupportedFileExtensionException(String errMsg) {
        super(errMsg);
    }
}