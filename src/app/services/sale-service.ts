import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { SaleModel } from '../models/sale.model';
import {SaleDashboard} from '../components/dashboards/sale-dashboard/sale-dashboard';
import {ReportService} from './report-service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private _apiUrl: string = "http://localhost:8080/contabilidad";

  constructor(private http: HttpClient,
              private reportService:ReportService) {
  }

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

  getTodaySalesData(): Observable<any> {
    return this.http.get<Record<string, any>>(`${this._apiUrl}/venta_diaria`);
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this._apiUrl}/total_ventas`);
  }

  sumTotalAmount(sales$: Observable<SaleModel[]>): Observable<number> {
    return sales$.pipe(
      map(sales => sales.reduce((acc, sale) => acc + sale.totalPay, 0))
    );
  }

  get apiUrl(): string {
    return this._apiUrl;
  }
}
