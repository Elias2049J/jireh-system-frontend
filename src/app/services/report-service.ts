import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl: string = "http://localhost:8080/reportes";

  constructor(private http: HttpClient) { }

  getTodaySalesReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/venta_diaria`, {
      responseType: 'blob'
    });
  }

  getSalesReportFilename(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/nombre_archivo`);
  }

  createTodaySalesReport(): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/crear`, null);
  }

  //util method for downloading a report
  downloadReport(): void {
    this.getTodaySalesReport().subscribe(blob => {
      this.getSalesReportFilename().subscribe(filename => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    });
  }
}
