package com.goofy.services;

import com.goofy.models.Achievement;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface AchievementService {
    List<Achievement.UserAchievement> getUsersAchievements(String uid) throws ExecutionException, InterruptedException;

    boolean updateUsersAchievements(Achievement.AchievementStats achievementStats, String uid) throws ExecutionException, InterruptedException;
}
