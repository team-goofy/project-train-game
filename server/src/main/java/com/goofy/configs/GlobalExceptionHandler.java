package com.goofy.configs;

import com.google.firebase.FirebaseException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        ErrorResponse errorsResponse = ErrorResponse.builder()
                .errors(errors)
                .code(ex.getStatusCode().value())
                .build();

        return new ResponseEntity<>(errorsResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FirebaseException.class)
    public final ResponseEntity<ErrorResponse> handleFirebaseExceptions(FirebaseException ex) {
        List<String> errors = Collections.singletonList(ex.getMessage());
        ErrorResponse errorsResponse = ErrorResponse.builder()
                .errors(errors)
                .code(ex.getHttpResponse().getStatusCode())
                .build();

        return new ResponseEntity<>(errorsResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponse> handleGeneralExceptions(Exception ex) {
        List<String> errors = Collections.singletonList(ex.getMessage());
        ErrorResponse errorsResponse = ErrorResponse.builder()
                .errors(errors)
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();

        return new ResponseEntity<>(errorsResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public final ResponseEntity<ErrorResponse> handleRuntimeExceptions(RuntimeException ex) {
        List<String> errors = Collections.singletonList(ex.getMessage());
        ErrorResponse errorsResponse = ErrorResponse.builder()
                .errors(errors)
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();

        return new ResponseEntity<>(errorsResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    private static class ErrorResponse {
        private int code;
        private List<String> errors;

    }

}
