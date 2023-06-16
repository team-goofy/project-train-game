package com.goofy.services;

import com.goofy.models.Achievement;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class AchievementServiceImpl implements AchievementService {
    private final Firestore firestore;

    private Achievement.UserAchievement mapToUserAchievement(Map<String, Object> achievementMap) {
        Achievement.UserAchievement userAchievement = new Achievement.UserAchievement();
        userAchievement.setUid((String) achievementMap.get("uid"));
        userAchievement.setProgress(((Long) achievementMap.get("progress")).intValue());
        userAchievement.setDateAchieved((String) achievementMap.get("dateAchieved"));
        userAchievement.setHasAchieved((boolean) achievementMap.get("hasAchieved"));
        return userAchievement;
    }

    private Achievement.UserAchievementUpdate mapToUserAchievementUpdate(Map<String, Object> achievementMap) {
        Achievement.UserAchievementUpdate userAchievementUpdate = new Achievement.UserAchievementUpdate();
        userAchievementUpdate.setUid((String) achievementMap.get("uid"));
        userAchievementUpdate.setProgress(((Long) achievementMap.get("progress")).intValue());
        userAchievementUpdate.setDateAchieved((String) achievementMap.get("dateAchieved"));
        userAchievementUpdate.setHasAchieved((boolean) achievementMap.get("hasAchieved"));
        return userAchievementUpdate;
    }

    @Override
    public List<Achievement.UserAchievement> getUsersAchievements(String uid) throws ExecutionException, InterruptedException {
        DocumentSnapshot userSnapshot = firestore.collection("user").document(uid).get().get();

        List<Achievement.UserAchievement> userAchievementList = new ArrayList<>(new ArrayList<>(
                (List<Map<String, Object>>) userSnapshot.getData().get("achievements"))
                .stream()
                .map(this::mapToUserAchievement)
                .toList());

        for (Achievement.UserAchievement userAchievement : userAchievementList) {
            Achievement achievement = this.firestore.collection("achievements").document(
                    userAchievement.getUid()).get().get().toObject(Achievement.class);

            userAchievement.setTitle(achievement.getTitle());
            userAchievement.setDescription(achievement.getDescription());
            userAchievement.setValueToReach(achievement.getValueToReach());
            userAchievement.setTag(achievement.getTag());
            userAchievement.setMatIcon(achievement.getMatIcon());
            userAchievement.setBgColor(achievement.getBgColor());
        }

        userAchievementList.sort(Comparator.comparing(Achievement.UserAchievement::getTag)
                .thenComparing(Achievement.UserAchievement::getValueToReach));
        return userAchievementList;
    }

    @Override
    public boolean updateUsersAchievements(Achievement.AchievementStats achievementStats, String uid)
            throws ExecutionException, InterruptedException {
        boolean achievedAnyAchievements = false;

        DocumentReference userAchievementsRef = this.firestore.collection("user").document(uid);
        DocumentSnapshot userSnapshot = userAchievementsRef.get().get();

        List<Achievement.UserAchievementUpdate> userAchievementList = new ArrayList<>(new ArrayList<>(
                (List<Map<String, Object>>) userSnapshot.getData().get("achievements"))
                .stream()
                .map(this::mapToUserAchievementUpdate)
                .toList());

        for (Achievement.UserAchievementUpdate userAchievementUpdate : userAchievementList) {
            if (userAchievementUpdate.isHasAchieved()) {
                continue;
            }

            Achievement achievement = this.firestore.collection("achievements").document(
                    userAchievementUpdate.getUid()).get().get().toObject(Achievement.class);

            if (achievement.getTag().equals("totalTime")) {
                userAchievementUpdate.setProgress(userAchievementUpdate.getProgress() + achievementStats.getTotalTripDuration());
            } else if (achievement.getTag().equals("amountTrips")) {
                userAchievementUpdate.setProgress(userAchievementUpdate.getProgress() + 1);
            } else {
                userAchievementUpdate.setProgress(achievementStats.getTotalVisitedStations());
            }

            if (userAchievementUpdate.getProgress() >= achievement.getValueToReach()) {
                if (!achievement.getTag().equals("amountTrips")) {
                    userAchievementUpdate.setProgress(achievement.getValueToReach());
                }

                userAchievementUpdate.setHasAchieved(true);
                userAchievementUpdate.setDateAchieved(ZonedDateTime.now(ZoneId.of("Europe/Paris"))
                        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX")));
                achievedAnyAchievements = true;
            }
        }

        ApiFuture<WriteResult> writeResult;
        writeResult = userAchievementsRef.update("achievements", userAchievementList);

        // Block until the write operation is complete and the result is available.
        try {
            writeResult.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error updating the user's achievements to Firestore", e);
        }

        return achievedAnyAchievements;
    }
}
