import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-achievement-card',
  imports: [DecimalPipe],
  templateUrl: './achievement-card.component.html',
  styleUrl: './achievement-card.component.scss',
})
export class AchievementCardComponent {
  iotAchievement = input<number>();
}
