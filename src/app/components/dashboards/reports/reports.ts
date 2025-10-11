import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {
  constructor(private reportsService: ReportsService){}
  
  ngOnInit(): void {
    
  }
  


}
