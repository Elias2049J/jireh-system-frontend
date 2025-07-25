import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleModel } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl: string = "http://localhost:8080/contabilidad";

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<SaleModel[]> {
    return this.http.get<SaleModel[]>(`${this.apiUrl}/lista_ventas_completa`);
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

  getTodaySalesData(): Observable<any> { // DailySaleDTO
    return this.http.get<any>(`${this.apiUrl}/venta_diaria`);
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total_ventas`);
  }
}
