export interface AchievementUser  {
  uid: string;
  title: string;
  description: string;
  valueToReach: number;
  tag: string;
  matIcon: string;
  bgColor: string;
  progress: number;
  dateAchieved: string;
  hasAchieved: boolean;
}
