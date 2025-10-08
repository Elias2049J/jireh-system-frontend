import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReportService } from './report-service';
import {ApiUrl} from '../models/ApiUrl';
import {PaymentDTO} from '../models/payment.dto';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private apiUrl: string = ApiUrl.URL+"/ventas";

  constructor(
    private http: HttpClient,
    private reportService: ReportService
  ) {}

  getAllSales(): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}`);
  }

  getTodaySales(): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}/ventas_hoy`);
  }

  openCash(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/abrir_caja`);
  }

  closeCash(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/cerrar_caja`);
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total_ventas`);
  }
}
