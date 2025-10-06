import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MesaDTO } from '../models/mesa.dto';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl: string = ApiUrl.URL+'/mesas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MesaDTO[]> {
    return this.http.get<MesaDTO[]>(this.apiUrl);
  }

  create(mesa: MesaDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/create`, mesa);
  }

  update(mesa: MesaDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/update`, mesa);
  }

  delete(idMesa: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${idMesa}/delete`);
  }
}

