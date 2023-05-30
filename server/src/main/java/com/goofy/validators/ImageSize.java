package com.goofy.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;

@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ImageSizeValidator.class)
public @interface ImageSize {
    String message() default "Image size must be between {min}mb and {max}mb";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    double min() default 0;
    double max() default Double.MAX_VALUE;
}