package com.goofy.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class ImageSizeValidator implements ConstraintValidator<ImageSize, MultipartFile> {
    private long minSize;
    private long maxSize;
    private String message;

    @Override
    public void initialize(ImageSize constraintAnnotation) {
        this.minSize = (long) (constraintAnnotation.min() * 1024 * 1024);
        this.maxSize = (long) (constraintAnnotation.max() * 1024 * 1024);
        this.message = constraintAnnotation.message();
    }

    @Override
    public boolean isValid(MultipartFile value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        long size = value.getSize();
        if (size < minSize || size > maxSize) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(message)
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}