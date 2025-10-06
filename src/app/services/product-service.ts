import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';
import {ApiUrl} from '../models/ApiUrl';
import { OptionListDTO } from '../models/option-list.dto';
import { OptionDTO } from '../models/option.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = ApiUrl.URL+"/products";

  constructor(
    private http: HttpClient
  ) { }

  getAllByMenuId(idMenu: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/menu/${idMenu}`);
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

  getAllOptionLists(): Observable<OptionListDTO[]> {
    return this.http.get<OptionListDTO[]>(this.apiUrl + '/option-lists');
  }

  getOptionListById(id: number): Observable<OptionListDTO> {
    return this.http.get<OptionListDTO>(`${this.apiUrl}/option-lists/${id}`);
  }

  createOptionList(dto: OptionListDTO): Observable<OptionListDTO> {
    return this.http.post<OptionListDTO>(`${this.apiUrl}/option-lists`, dto);
  }

  updateOptionList(dto: OptionListDTO): Observable<OptionListDTO> {
    return this.http.put<OptionListDTO>(`${this.apiUrl}/option-lists`, dto);
  }

  deleteOptionList(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/option-lists/${id}`);
  }

  getAllOptions(): Observable<OptionDTO[]> {
    return this.http.get<OptionDTO[]>(`${this.apiUrl}/options/all`);
  }

  getOptionById(id: number): Observable<OptionDTO> {
    return this.http.get<OptionDTO>(`${this.apiUrl}/options/${id}`);
  }

  createOption(dto: OptionDTO): Observable<OptionDTO> {
    return this.http.post<OptionDTO>(`${this.apiUrl}/options`, dto);
  }

  updateOption(dto: OptionDTO): Observable<OptionDTO> {
    return this.http.put<OptionDTO>(`${this.apiUrl}/options`, dto);
  }

  deleteOption(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/options/${id}`);
  }
}
