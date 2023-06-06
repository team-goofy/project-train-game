package com.goofy.utils;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UUIDGeneratorImpl implements UUIDGenerator{
    @Override
    public UUID generateUUID() {
        return UUID.randomUUID();
    }
}
