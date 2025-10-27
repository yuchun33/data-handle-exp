import { Injectable, signal } from '@angular/core';
import mqtt, { MqttClient } from 'mqtt';

export interface IoTData {
  line: string;
  // module: number;
  // slot: number;
  ok: number;
  ng: number;
  key?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client!: MqttClient;
  iotData = signal<IoTData[]>([]);
  iotAchievement = signal<number>(0);

  constructor() {
    const data: IoTData[] = [];
    for (let l = 1; l <= 3; l++) {
      const line = `LINE-${l}`;
      for (let m = 0; m < 6; m++) {
        for (let s = 0; s < 6; s++) {
          const key = `ms-${m}-${s}`;
          const ok = 0;
          const ng = 0;
          data.push({ line, key, ok, ng });
        }
      }
    }
    this.iotData.set(data);
  }

  connect() {
    this.client = mqtt.connect('ws://192.168.56.10:9001');
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('iot-data', (err) => {
        if (err) {
          console.error('Subscription error:', err);
          return;
        }
      });
      this.client.subscribe('iot-achievement', (err) => {
        if (err) {
          console.error('Subscription error:', err);
          return;
        }
      });
    });

    this.client.on('message', (topic, message) => {
      const raw = JSON.parse(message.toString());

      if (topic === 'iot-data') {
        // 轉成符合 IoTData 的格式
        const data: IoTData = {
          line: String(raw.line),
          key: `ms-${raw.module}-${raw.slot}`,
          // module: Number(raw.module),
          // slot: Number(raw.slot),
          ok: Number(raw.ok),
          ng: Number(raw.ng),
        };

        this.iotData.update((arr) =>
          arr.map((item, _) => {
            if (item.line === data.line && item.key === data.key) {
              return {
                ...item,
                ok: data.ok,
                ng: data.ng,
              };
            } else {
              return item;
            }
          })
        );
      }

      if (topic === 'iot-achievement') {
        console.log('Received achievement:', raw);
        this.iotAchievement.set(Number(raw.achievement));
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT error:', err);
    });
  }

  disconnect() {
    console.log('Disconnected to MQTT broker');
    this.client.end();
  }
}
