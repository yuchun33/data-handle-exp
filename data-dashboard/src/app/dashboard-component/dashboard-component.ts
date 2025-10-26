import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { ChartComponent } from '../chart-component/chart-component';
import { IoTData, MqttService } from '../services/mqtt.service';

@Component({
  selector: 'app-dashboard-component',
  imports: [ChartComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnDestroy {
  mqtt = inject(MqttService);
  data: IoTData[] = [];

  constructor() {
    for (let l = 1; l <= 3; l++) {
      const line = `LINE-${l}`;
      for (let m = 0; m <= 6; m++) {
        for (let s = 0; s <= 6; s++) {
          const key = `ms-${m}-${s}`;
          const ok = 1;
          const ng = 0;
          this.data.push({ line, key, ok, ng });
        }
      }
    }
    // this.mqtt.connect();
  }

  change() {
    // 不會改變
    this.data = this.data.map((item) => {
      return {
        ...item,
        ok: item.ok + 1,
      };
    });
  }

  ngOnDestroy() {
    // this.mqtt.disconnect();
  }
}
