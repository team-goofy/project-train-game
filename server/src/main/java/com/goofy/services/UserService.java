package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

public interface UserService {
    UserRecord createUser(UserDTO user) throws FirebaseAuthException;
}
