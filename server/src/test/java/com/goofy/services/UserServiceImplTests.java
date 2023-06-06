package com.goofy.services;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class UserServiceImplTests {

    // check username tests
    @Test
    void check_if_username_exists(){
        String username = "mandylbbh";

//        assertNotSame();
    }

    @Test
    void check_if_username_does_not_exist(){
        String username = "mandylbbh";

//        assertSame();
    }

    //Save user tests
    @Test
    void can_save_correct_user(){

    }

    @Test
    void can_not_save_user_with_existing_username(){

    }

    @Test
    void can_not_save_user_without_username(){

    }

    @Test
    void can_not_save_user_with_existing_email(){

    }

    @Test
    void can_not_save_user_without_email(){

    }

    @Test
    void can_not_save_user_with_faulty_password(){

    }

    @Test
    void can_not_save_user_without_password(){

    }

    // get profile tests
    @Test
    void can_get_user_profile(){

    }

    @Test
    void can_not_get_profile_when_user_not_existing(){

    }


    // change username tests
    @Test
    void can_not_change_username_to_existing_username(){

    }

    @Test
    void can_change_username_to_non_existing_username(){

    }

    @Test
    void can_not_change_username_to_empty(){

    }

    @Test
    void can_add_username_with_unconventional_characters(){
        //like japanese
    }


}
