import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplyModel } from '../models/supply.model';
import { LotModel } from '../models/lot.model';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl: string = ApiUrl.URL+"/inventario";

  constructor(private http: HttpClient) { }

  getAllSupplies(): Observable<SupplyModel[]> {
    return this.http.get<SupplyModel[]>(`${this.apiUrl}/insumos`);
  }

  createSupply(supply: SupplyModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/insumos/registrar`, supply);
  }

  updateSupply(supply: SupplyModel): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/insumos/editar`, supply);
  }

  getSupplyById(id: number): Observable<SupplyModel> {
    return this.http.get<SupplyModel>(`${this.apiUrl}/insumos/${id}`);
  }

  getSupplyByName(name: string): Observable<SupplyModel> {
    return this.http.get<SupplyModel>(`${this.apiUrl}/insumos/${name}`);
  }

  deleteSupply(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/insumos/${id}/delete`);
  }

  // lots management methods
  getSuppliesWithLowStock(): Observable<SupplyModel[]> {
    return this.http.get<SupplyModel[]>(`${this.apiUrl}/stock-bajo`);
  }

  registerLot(lot: LotModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/lotes/registrar`, lot);
  }

  getLotById(id: number): Observable<LotModel> {
    return this.http.get<LotModel>(`${this.apiUrl}/lotes/${id}`);
  }

  getLotsBySupplyId(supplyId: number): Observable<LotModel[]> {
    return this.http.get<LotModel[]>(`${this.apiUrl}/insumo/${supplyId}/lotes`);
  }

  getLotsBetweenDates(fechaInicio: string, fechaFin: string): Observable<LotModel[]> {
    return this.http.get<LotModel[]>(`${this.apiUrl}/lotes/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
