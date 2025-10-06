import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import {ApiUrl} from '../models/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = ApiUrl.URL+"/usuarios";

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}`);
  }

  createUser(user: UserModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/crear`, user);
  }

  updateUser(user: UserModel): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/actualizar`, user);
  }

  getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/eliminar/${id}`);
  }
}
