import { Component } from '@angular/core';
import { LiveService } from '../live-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss'
})
export class DashboardComponent {
  data:any[] = [];
  constructor(ls: LiveService) { ls.data$.subscribe(v => this.data = v); }
}
