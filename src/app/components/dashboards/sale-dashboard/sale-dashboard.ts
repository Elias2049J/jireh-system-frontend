import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SaleModel} from '../../../models/sale.model';
import {SaleService} from '../../../services/sale-service';
import {AsyncPipe} from '@angular/common';
import {SaleForm} from '../../forms/sale-form/sale-form';
import {ReportService} from '../../../services/report-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-dashboard',
  imports: [
    AsyncPipe,
    SaleForm
  ],
  templateUrl: './sale-dashboard.html',
  styleUrl: './sale-dashboard.scss'
})
export class SaleDashboard implements OnInit {
  ngOnInit(): void {
    this.loadSales();
    this.getTotalAmountToday();
  }

  constructor(private saleService: SaleService,
              private reportService: ReportService) {
  }

  private _sales = new BehaviorSubject<SaleModel[]>([]);
  private _todaySales = new BehaviorSubject<SaleModel[]>([]);
  private _totalAmountToday = new BehaviorSubject<number>(0);

  showForm: boolean = false;
  sales$: Observable<SaleModel[]> = this._sales.asObservable();
  todaySales$: Observable<SaleModel[]> = this._todaySales.asObservable();
  totalAmountToday$: Observable<number> = this._totalAmountToday.asObservable();
  actionType: 'add' | 'edit' | 'delete' | null = null;


  loadSales(): void {
    this.saleService.getTodaySales().subscribe({
      next: (data) => {
        this._todaySales.next(data);
        console.info("Received today sales:", data);
      },
      error: (err) => {
        console.error(`Error getting today sales: ${err}`);
      }
    });
  }

  handleAction(type: 'add' | 'edit' | 'delete'): void {
    this.showForm = true;
    this.actionType = type;
  }

  regSale(saleData:{[key:string]: any;}) {
    this.showForm = false;
    this.actionType = null;
    console.log(saleData);
    const newSale: SaleModel = {id: null as any, totalPay:saleData['totalPay'], dateTime:null as any};
    console.log(newSale);
    this.saleService.registerSale(newSale).subscribe({
      next: (created) => {
        console.info('New sale registered successfully ', created);
        this.loadSales();
        this.getTotalAmountToday();
      },
      error: (err) => {
        console.error(`Error registering sale: ${err}`);
      }
    })
  }

  openCash(): void {
    console.info("Opening cash");
    this.saleService.openCash().subscribe({
      next: (result) => {
        console.info("Cash Open:", result);
        Swal.fire({
          title: '¡Caja Abierta!',
          text: 'La caja ha sido abierta correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#198754'
        });
      },
      error: (err) => {
        console.error("Error opening cash", err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo abrir la caja. Por favor, intente de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  getTotalAmountToday(): void {
    this.saleService.getTodaySalesData().subscribe({
      next: (data: Record<string, any>) => {
        this._totalAmountToday.next(data['totalAmount']);
        console.log(`Total amount assigned successfully: ${data['totalAmount']}`);
      },
      error: (err) => {
        console.error(`Error getting total amount today: ${err}`);
      }
    })
  }

  closeCash():void {
    this.saleService.closeCash().subscribe({
      next: (result) => {
        console.info("Closing cash result", result);
        if (result) this.reportService.downloadSalesReport("/ventas_hoy")
      },
      error: (err) => {
        console.error(`Error closing cash: ${err}`);
      }
    });
  }
}
