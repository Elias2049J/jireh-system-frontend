import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = "http://localhost:8080/products"

  constructor(
    private http: HttpClient
  ) { }

  getAllByMenuId(idMenu: number): Observable<Product[]> {
    const url = this.apiUrl + "/" + idMenu;
    return this.http.get<Product[]>(url)
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  create(product: Product): Observable<boolean> {
    const url = this.apiUrl + "/create";
    return this.http.post<boolean>(url, product);
  }

  delete(id: number | null): Observable<boolean> {
    if (id === null) {
      throw new Error("No se puede eliminar un producto con ID nulo");
    }
    const url = this.apiUrl + `/${id}`+"/delete";
    return this.http.get<boolean>(url);
  }

  update(product: Product): Observable<boolean> {
    const url = this.apiUrl + "/update";
    return this.http.put<boolean>(url, product);
  }
}
