package com.goofy.services;

import java.io.IOException;

import com.goofy.dtos.TripImageDTO;
import com.google.cloud.storage.BlobId;

public interface TripService {
    BlobId saveImageToStorage(TripImageDTO image, String userId) throws IOException;    
}
