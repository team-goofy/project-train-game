package com.goofy.dtos;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TripImageDTO {
    @NotNull(message = "Image can not be null")
    private MultipartFile image;

    @NotEmpty(message = "Trip id can not be empty")
    @NotBlank(message = "Trip id can not be blank")
    private String tripId;

    @NotEmpty(message = "UIC code can not be empty")
    @NotBlank(message = "UIC code can not be blank")
    private String uicCode;

    @NotEmpty(message = "Ltd can not be empty")
    @NotBlank(message = "Ltd can not be blank")
    private String ltd;

    @NotEmpty(message = "Lng can not be empty")
    @NotBlank(message = "Lng can not be blank")
    private String lng;
}