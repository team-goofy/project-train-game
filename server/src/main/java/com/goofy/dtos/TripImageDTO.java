package com.goofy.dtos;

import com.goofy.validators.ImageSize;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TripImageDTO {
    @NotNull(message = "Image can not be null")
    @ImageSize(max = 3.0)
    private MultipartFile image;

    @NotNull(message = "Trip id can not be empty")
    @Positive(message = "Trip id must be positive")
    private Long tripId;

    @NotEmpty(message = "UIC code can not be empty")
    @NotBlank(message = "UIC code can not be blank")
    private String uicCode;
}