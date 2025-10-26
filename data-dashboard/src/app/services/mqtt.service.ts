import { Injectable, signal, computed } from '@angular/core';
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

  constructor() {
    const data: IoTData[] = [];
    for (let l = 1; l <= 3; l++) {
      const line = `LINE-${l}`;
      for (let m = 0; m <= 6; m++) {
        for (let s = 0; s <= 6; s++) {
          const key = `ms-${m}-${s}`;
          const ok = 1;
          const ng = 0;
          data.push({ line, key, ok, ng });
        }
      }
    }
    this.iotData.set(data);
  }

  // groupedMessages = computed(() => {
  //   const grouped = this.iotData().reduce((acc, item) => {
  //     if (!acc[item.line]) acc[item.line] = [];
  //     acc[item.line].push(item);
  //     return acc;
  //   }, {} as Record<string, IoTData[]>);

  //   for (const line in grouped) {
  //     grouped[line].sort((a, b) => (a.module === b.module ? a.slot - b.slot : a.module - b.module));
  //   }

  //   console.log('Grouped Messages:', grouped);
  //   return grouped;
  // });

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
    });

    this.client.on('message', (topic, message) => {
      const raw = JSON.parse(message.toString());

      // 轉成符合 IoTData 的格式
      const data: IoTData = {
        line: String(raw.line),
        key: `ms-${raw.module}-${raw.slot}`,
        // module: Number(raw.module),
        // slot: Number(raw.slot),
        ok: Number(raw.ok),
        ng: Number(raw.ng),
      };

      console.log('Received MQTT message:', this.iotData(), data);

      this.iotData.update((arr) =>
        arr.map((item, _) => {
          if (item.line === data.line && item.key === data.key) {
            console.log('Updating item:', item, 'with data:', data);
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

      console.log('Received MQTT message: 2', this.iotData());
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
