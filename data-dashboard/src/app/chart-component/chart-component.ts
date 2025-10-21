import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.html',
  standalone: true,
  imports: [ChartModule],
})
export class ChartComponent implements OnInit {
  basicData: any;
  intervalId: any;

  basicOptions: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    console.log('changes');
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
      const data: { key: string; ok: number; ng: number }[] = [];

      for (let m = 1; m <= 6; m++) {
        for (let s = 1; s <= 6; s++) {
          const key = `ms-${m}-${s}`;
          const ok = Math.floor(Math.random() * 50) + 50;
          const ng = Math.floor(Math.random() * 1) + 5;
          data.push({ key, ok, ng });
        }
      }

      this.basicData = {
        datasets: [
          {
            label: 'ok',
            data: data,
            backgroundColor: 'rgba(68, 241, 11, 1)',
            // borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
            parsing: {
              xAxisKey: 'key',
              yAxisKey: 'ok',
            },
          },
          {
            label: 'ng',
            data: data,
            backgroundColor: 'rgba(255, 151, 142, 1)',
            // borderColor: 'rgba(255, 255, 255, 1)',
            parsing: {
              xAxisKey: 'key',
              yAxisKey: 'ng',
            },
          },
        ],
      };

      this.basicOptions = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            // labels: {
            //   color: textColor,
            // },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            // grid: {
            //   color: surfaceBorder,
            // },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            // grid: {
            //   color: surfaceBorder,
            // },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
