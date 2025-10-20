import { Component } from '@angular/core';
import { LiveService } from '../live-service';
import { ChartComponent } from '../chart-component/chart-component';

@Component({
  selector: 'app-dashboard-component',
  imports: [ChartComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent {
  // data:any[] = [];
  // constructor(ls: LiveService) { ls.data$.subscribe(v => this.data = v); }
}
