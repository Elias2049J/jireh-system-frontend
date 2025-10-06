import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Menu} from '../models/menu.model';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl: string = ApiUrl.URL+"/menus";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  create(menu: Menu): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/create`, menu);
  }

  update(menu: Menu): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/update`, menu);
  }

  delete(idMenu: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${idMenu}/delete`);
  }
}
