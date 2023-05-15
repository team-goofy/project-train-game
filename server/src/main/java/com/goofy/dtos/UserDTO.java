package com.goofy.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserDTO {
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Email is invalid")
    private String email;

    @NotNull(message = "Password can not be null")
    @NotBlank(message = "Password can not be empty")
    @Size(min = 6, max = 40, message = "Password should be between 6 and 40 characters")
    private String password;

    @NotNull(message = "Username can not be null")
    @NotBlank(message = "Username can not be empty")
    @Size(min = 4, max = 25, message = "Username should be between 4 and 25 characters")
    private String username;

}
