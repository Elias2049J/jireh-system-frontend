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
    return this.http.get<Menu[]>(this.apiUrl);
  }

  getById(id: number): Observable<Menu> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Menu>(url);
  }

  create(menu: Menu): Observable<boolean> {
    const url = this.apiUrl + "/create";
    return this.http.post<boolean>(url, menu);
  }

  update(menu: Menu): Observable<boolean> {
    const url = this.apiUrl + "/update";
    return this.http.put<boolean>(url, menu);
  }

  delete(idMenu: number): Observable<boolean> {
    const url = this.apiUrl + "/delete";
    return this.http.delete<boolean>(url);
  }
}
