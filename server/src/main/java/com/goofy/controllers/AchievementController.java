package com.goofy.controllers;

import com.goofy.models.*;
import com.goofy.services.AchievementService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/achievements")
@AllArgsConstructor
public class AchievementController {
    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<Object> getUsersAchievements(@RequestParam String uid)
            throws ExecutionException, InterruptedException {
        List<Achievement.UserAchievement> userAchievementList = this.achievementService.getUsersAchievements(uid);
        return ResponseEntity.ok(userAchievementList);
    }

    @PutMapping
    public ResponseEntity<Boolean> updateStats(
            @RequestBody @Valid Achievement.AchievementStats achievementStatsToUpdate, Principal principal
    ) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(this.achievementService.updateUsersAchievements(achievementStatsToUpdate, principal.getName()));
    }
}
