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

  basicOptions: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicData = {
        labels: Array.from({ length: 20 }, (_, i) => `${i + 1}`),
        datasets: [
          {
            // label: ',
            data: Array.from({ length: 20 }, () => Math.floor(Math.random() * (60 - 10 + 1)) + 10),
            backgroundColor: Array.from({ length: 20 }, () => 'rgba(68, 241, 11, 1)'),
            borderColor: Array.from({ length: 20 }, () => 'rgba(255, 255, 255, 1)'),
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            // labels: {
            //   // color: textColor,

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
