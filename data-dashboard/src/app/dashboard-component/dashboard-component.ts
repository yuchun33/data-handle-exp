import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { ChartComponent } from '../chart-component/chart-component';
import { IoTData, MqttService } from '../services/mqtt.service';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';

@Component({
  selector: 'app-dashboard-component',
  imports: [ChartComponent, AchievementCardComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnDestroy {
  mqtt = inject(MqttService);

  constructor() {
    this.mqtt.connect();
  }

  ngOnDestroy() {
    this.mqtt.disconnect();
  }
}
