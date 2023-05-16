import { Component } from '@angular/core';

@Component({
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
  loading: boolean = false;
  location?: string | null = "Amsterdam";
}
