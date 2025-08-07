import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, window} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private _apiUrl: string = "http://localhost:8080/reportes";
  private _routes: string[] = [
    "/descarga",
    "/ventas_hoy"
  ];

  constructor(private http: HttpClient) { }

  getTodaySalesReport(): Observable<Blob> {
    return this.http.get(`${this._apiUrl}/venta_diaria`, {
      responseType: 'blob'
    });
  }

  getSalesReportFilename(): Observable<string> {
    return this.http.get<string>(`${this._apiUrl}/nombre_archivo`);
  }

  createTodaySalesReport(): Observable<boolean> {
    return this.http.post<boolean>(`${this._apiUrl}/crear`, null);
  }

  fetchFile(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  getFileWithHeaders(url: string): Observable<HttpResponse<Blob>> {
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  getFileNameFromHeaders(response: HttpResponse<Blob>, defaultName: string = 'archivo.pdf'): string {
    const disposition = response.headers.get('Content-Disposition');
    if (disposition) {
      const match = /filename=([^;]+)/i.exec(disposition);
      if(match?.[1]) return match[1].trim();
    }
    return defaultName;
  }

  downloadFile(blob: Blob, filename: string): void {
    const a  = document.createElement('a');
    const urlBlob = URL.createObjectURL(blob);
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  }

  downloadFromUrl(url: string, defaultFilename: string = 'archivo.pdf') {
    this.getFileWithHeaders(url).subscribe({
      next: (response) => {
        if(!response.body) {
          console.error("Response body is empty");
          return;
        }
        const filename = this.getFileNameFromHeaders(response, defaultFilename);
        this.downloadFile(response.body, filename);
      },
      error: (err) => {
        console.error("Error downloading file", err)
      }
    });
  }

  downloadSalesReport(reportRoute: string): void {
    const url = this.apiUrl + this.routes[0] + reportRoute;
    this.downloadFromUrl(url, "Reporte de ventas.pdf")
  }

  get apiUrl(): string {
    return this._apiUrl;
  }
  get routes(): string[] {
    return this._routes;
  }
}
