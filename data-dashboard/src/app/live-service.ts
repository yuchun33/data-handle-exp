import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveService {
  constructor(private http: HttpClient) {}
  data$ = interval(2000).pipe(switchMap(() => this.http.get<any[]>('http://localhost:8000/api/agg')));
}
