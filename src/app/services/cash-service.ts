import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SaleModel } from '../models/sale.model';
import { ReportService } from './report-service';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private apiUrl: string = ApiUrl.URL+"/ventas";

  constructor(
    private http: HttpClient,
    private reportService: ReportService
  ) {}

  getAllSales(): Observable<SaleModel[]> {
    return this.http.get<SaleModel[]>(`${this.apiUrl}`);
  }

  getTodaySales(): Observable<SaleModel[]> {
    return this.http.get<SaleModel[]>(`${this.apiUrl}/ventas_hoy`);
  }

  registerSale(sale: SaleModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/registrar_venta`, sale);
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
