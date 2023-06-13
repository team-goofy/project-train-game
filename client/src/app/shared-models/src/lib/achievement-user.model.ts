export interface AchievementUser  {
  uid: string;
  title: string;
  description: string;
  valueToReach: number;
  tag: string;
  progress: number;
  dateAchieved: string;
  hasAchieved: boolean;
}
