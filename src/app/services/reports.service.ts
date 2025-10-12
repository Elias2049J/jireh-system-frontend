// src/app/services/reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface JirehReportPayload {
  promPlatSell: Array<{ value: number }>;
  gananciasTot: Array<{ total: number; moneda?: string }>;
  prodMoreSell: Array<{ producto: string; cantidad: number }>;
  gananciasDay: Array<{ fecha: string | Date; monto: number }>;
  prodMoreCons: Array<{ producto: string; cantidad: number }>;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private http: HttpClient) {}

  getDatosReporte(params: { desde?: string; hasta?: string }): Observable<JirehReportPayload> {
    let p = new HttpParams();
    if (params.desde) p = p.set('desde', params.desde);
    if (params.hasta) p = p.set('hasta', params.hasta);
    // Cuando tengas backend: return this.http.get<JirehReportPayload>('/api/reportes/jireh', { params: p });

    // MOCK mientras no hay backend
    return of({
      promPlatSell: [{ value: 7 }],
      gananciasTot: [{ total: 15980, moneda: 'S/.' }],
      prodMoreSell: [
        { producto: 'Plato A', cantidad: 120 },
        { producto: 'Plato B', cantidad: 95 },
        { producto: 'Plato C', cantidad: 60 }
      ],
      gananciasDay: [
        { fecha: '2025-10-01', monto: 980 },
        { fecha: '2025-10-02', monto: 1120 },
        { fecha: '2025-10-03', monto: 1340 }
      ],
      prodMoreCons: [
        { producto: 'Bebida X', cantidad: 80 },
        { producto: 'Bebida Y', cantidad: 65 },
        { producto: 'Bebida Z', cantidad: 50 }
      ]
    });
  }
}
