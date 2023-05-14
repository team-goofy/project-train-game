package com.goofy.models;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class User {
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password can not be null")
    @NotBlank(message = "Password can not be empty")
    @Min(value = 6, message = "Password should be at least 6 characters")
    @Max(value = 40, message = "Password should be at most 40 characters")
    private String password;

    @NotNull(message = "Username can not be null")
    @NotBlank(message = "Username can not be empty")
    @Min(value = 4, message = "Username should be at least 4 characters")
    @Max(value = 25, message = "Username should be at most 25 characters")
    private String displayName;

}
