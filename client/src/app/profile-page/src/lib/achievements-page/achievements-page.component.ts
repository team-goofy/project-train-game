import {Component, inject} from '@angular/core';
import {AuthService} from "@client/shared-services";
import {AchievementUser} from "../../../../shared-models/src/lib/achievement-user.model";

@Component({
  selector: 'app-achievements-page',
  templateUrl: './achievements-page.component.html',
  styleUrls: ['../stats-page/stats-page.component.scss']
})
export class AchievementsPageComponent {
  private authService: AuthService = inject(AuthService);
  protected readonly Number = Number;

  achievementsList: AchievementUser[] = [];

  ngOnInit(): void {
    this.getUserAchievements();
  }

  getUserAchievements(): void {
    this.authService.getUsersAchievements().pipe().subscribe(achievements => {
      this.achievementsList = achievements;
    });
  }

  formatDate(date: string): string {
    return new Date(date.split('+')[0]).toLocaleDateString("en-NL");
  }
}
