import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SaleModel } from '../models/sale.model';
import { ReportService } from './report-service';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private _apiUrl: string = "http://localhost:8080/ventas";

  constructor(
    private http: HttpClient,
    private reportService: ReportService
  ) {}

  getAllSales(): Observable<SaleModel[]> {
    return this.http.get<SaleModel[]>(`${this._apiUrl}/lista_ventas_completa`);
  }

  getTodaySales(): Observable<SaleModel[]> {
    return this.http.get<SaleModel[]>(`${this._apiUrl}/ventas_hoy`);
  }

  registerSale(sale: SaleModel): Observable<boolean> {
    return this.http.post<boolean>(`${this._apiUrl}/registrar_venta`, sale);
  }

  openCash(): Observable<boolean> {
    return this.http.get<boolean>(`${this._apiUrl}/abrir_caja`);
  }

  closeCash(): Observable<boolean> {
    return this.http.get<boolean>(`${this._apiUrl}/cerrar_caja`);
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this._apiUrl}/total_ventas`);
  }

  get apiUrl(): string {
    return this._apiUrl;
  }
}
