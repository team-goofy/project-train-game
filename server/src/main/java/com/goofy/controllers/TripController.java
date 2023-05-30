package com.goofy.controllers;

import com.goofy.dtos.TripDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.io.IOException;
import java.security.Principal;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.goofy.dtos.TripImageDTO;
import com.goofy.services.TripService;
import com.google.cloud.storage.BlobId;

@Transactional
@Controller
@RequestMapping("/trip")
@AllArgsConstructor
public class TripController {
        private final TripService tripService;

        @PostMapping
        public ResponseEntity<Object> saveTrip(@RequestBody() @Valid TripDTO trip, Principal principal) {
                String tripId = this.tripService.saveTripToDatabase(trip, principal.getName());
                return ResponseEntity.ok(tripId);
        }

        @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<BlobId> saveImage(@ModelAttribute() @Valid TripImageDTO image, Principal principal)
                        throws IOException {
                BlobId blobId = tripService.saveImageToStorage(image, principal.getName());
                return ResponseEntity.ok(blobId);
        }
}
