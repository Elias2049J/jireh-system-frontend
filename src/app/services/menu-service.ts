import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Menu} from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl: string = "http://localhost:8080/menus";

  constructor(private http: HttpClient) {}

  //get request for getting all menus of the db
  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  //post request for creating a menu using the Menu object
  create(menu: Menu): Observable<boolean> {
    const url = this.apiUrl + "/create";
    return this.http.post<boolean>(url, menu);
  }

  update(menu: Menu): Observable<Menu> {
    const url = this.apiUrl + "/update";
    return this.http.put<Menu>(url, menu);
  }

  delete(idMenu: number): Observable<boolean> {
    const url = this.apiUrl + "/delete";
    return this.http.delete<boolean>(url);
  }
}
