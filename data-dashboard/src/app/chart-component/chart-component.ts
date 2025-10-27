import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  input,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.html',
  standalone: true,
  imports: [ChartModule],
})
export class ChartComponent implements OnInit {
  basicChart: any;
  basicOptions: any;
  intervalId: any;
  data = input<any[]>();
  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {
    effect(() => {
      this.updateChartData();
    });
  }

  ngOnInit() {
    this.initChart();
  }

  updateChartData() {
    this.basicChart = {
      datasets: [
        {
          label: 'ok',
          data: this.data(),
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
          data: this.data(),
          backgroundColor: 'rgba(255, 151, 142, 1)',
          // borderColor: 'rgba(255, 255, 255, 1)',
          parsing: {
            xAxisKey: 'key',
            yAxisKey: 'ng',
          },
        },
      ],
    };
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.updateChartData();

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
