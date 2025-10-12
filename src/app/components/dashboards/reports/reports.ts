// src/app/pages/reports/reports.ts
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService, JirehReportPayload } from '../../../services/reports.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PALETTE = ['#4F46E5','#22C55E','#F59E0B','#EF4444','#06B6D4','#8B5CF6','#10B981','#F97316','#3B82F6','#E11D48'];

function pickColors(n: number) {
  const solid = Array.from({ length: n }, (_, i) => PALETTE[i % PALETTE.length]);
  const translucent = solid.map(hex => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},0.25)`;
  });
  return { solid, translucent };
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements AfterViewInit {
  desde = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0,10);
  hasta = new Date().toISOString().slice(0,10);

  data!: JirehReportPayload;

  kpiProm = 0;
  kpiGan = 0;
  kpiMon = 'S/.';

  ventasDiaCfg: ChartConfiguration<'line'> = {
    data: { labels: [], datasets: [{ label: 'Ganancias por día', data: [], fill: true, tension: 0.3 }] },
    type: 'line'
  };
  topVendidosCfg: ChartConfiguration<'bar'> = {
    data: { labels: [], datasets: [{ label: 'Productos más vendidos', data: [] }] },
    type: 'bar'
  };
  topConsCfg: ChartConfiguration<'bar'> = {
    data: { labels: [], datasets: [{ label: 'Productos más consumidos', data: [] }] },
    type: 'bar'
  };
  chartOpts: ChartOptions = { responsive: true, maintainAspectRatio: false };

  loading = true;
  error?: string;

  constructor(private api: ReportsService) {}

  ngAfterViewInit(): void { this.cargar(); }

  cargar() {
    this.loading = true; this.error = undefined;
    this.api.getDatosReporte({ desde: this.desde, hasta: this.hasta }).subscribe({
      next: (payload) => {
        this.data = payload;
        this.kpiProm = payload.promPlatSell?.[0]?.value ?? 0;
        this.kpiGan  = payload.gananciasTot?.[0]?.total ?? 0;
        this.kpiMon  = payload.gananciasTot?.[0]?.moneda ?? 'S/.';

      // Ganancias por día (LINEA): un color por punto (marcadores) y relleno
      {
        const labels = payload.gananciasDay.map(x => ('' + x.fecha).slice(5));
        const data   = payload.gananciasDay.map(x => x.monto);
        const { solid, translucent } = pickColors(data.length);

        this.ventasDiaCfg = {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Ganancias',
              data,
              // color de la línea (elige uno, p.ej. el primero)
              borderColor: solid[0] ?? '#3B82F6',
              backgroundColor: translucent[0] ?? 'rgba(59,130,246,.25)',
              fill: true,
              tension: 0.3,
              // colores POR PUNTO
              pointBackgroundColor: solid,
              pointBorderColor: solid,
              pointRadius: 4,
              pointHoverRadius: 5
            }]
          }
        };
      }

      // Productos más vendidos (BARRAS): un color por barra
      {
        const labels = payload.prodMoreSell.map(x => x.producto);
        const data   = payload.prodMoreSell.map(x => x.cantidad);
        const { solid, translucent } = pickColors(data.length);

        this.topVendidosCfg = {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Vendidos',
              data,
              backgroundColor: translucent,  // relleno por barra
              borderColor: solid,            // borde por barra
              borderWidth: 1
            }]
          }
        };
      }

      // Productos más consumidos (BARRAS): un color por barra
      {
        const labels = payload.prodMoreCons.map(x => x.producto);
        const data   = payload.prodMoreCons.map(x => x.cantidad);
        const { solid, translucent } = pickColors(data.length);

        this.topConsCfg = {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Consumidos',
              data,
              backgroundColor: translucent,
              borderColor: solid,
              borderWidth: 1
            }]
          }
        };
      }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false; this.error = 'No se pudo cargar';
        console.error(err);
      }
    });
  }

  exportXlsx(dataset: 'PromPlatSell'|'GananciasTot'|'ProdMoreSell'|'GananciasDay'|'ProdMoreCons') {
    let rows: any[] = [];
    if (dataset === 'PromPlatSell') rows = this.data?.promPlatSell ?? [];
    else if (dataset === 'GananciasTot') rows = this.data?.gananciasTot ?? [];
    else if (dataset === 'ProdMoreSell') rows = this.data?.prodMoreSell ?? [];
    else if (dataset === 'GananciasDay') rows = this.data?.gananciasDay ?? [];
    else if (dataset === 'ProdMoreCons') rows = this.data?.prodMoreCons ?? [];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, dataset);
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `jireh_${dataset}_${this.desde}_${this.hasta}.xlsx`);
  }
}
