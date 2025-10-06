import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SaleModel} from '../../../models/sale.model';
import {CashService} from '../../../services/cash-service';
import {AsyncPipe} from '@angular/common';
import {SaleForm} from '../../forms/sale-form/sale-form';
import {ReportService} from '../../../services/report-service';
import { NotificationService } from '../../../services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cash-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    SaleForm
  ],
  templateUrl: './cash-dashboard.html'
})
export class CashDashboard implements OnInit {
  ngOnInit(): void {
    this.loadSales();
    this.getTotalAmountToday();
  }

  constructor(private cashService: CashService,
              private reportService: ReportService,
              private notificationService: NotificationService) {
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
    this.cashService.getTodaySales().subscribe({
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
    this.cashService.registerSale(newSale).subscribe({
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
    this.cashService.openCash().subscribe({
      next: (response) => {
        console.info("Cash Open:", response);
        this.notificationService.success('La caja ha sido abierta correctamente');
      },
      error: (err) => {
        console.error("Error opening cash", err);
        this.notificationService.error('No se pudo abrir la caja. Por favor, intente de nuevo.');
      }
    });
  }

  getTotalAmountToday(): void {
    this.cashService.getTodaySales().subscribe({
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
    Swal.fire({
      title: '¿Cerrar caja?',
      text: 'Esta acción generará un reporte de ventas del día y cerrará la caja. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cashService.closeCash().subscribe({
          next: (result) => {
            console.info("Closing cash result", result);
            if (result) {
              this.reportService.downloadSalesReport("/ventas_hoy");
              Swal.fire({
                title: '¡Caja cerrada!',
                text: 'La caja ha sido cerrada correctamente y se ha generado el reporte',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#198754'
              });
            }
          },
          error: (err) => {
            console.error(`Error closing cash: ${err}`);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo cerrar la caja. Por favor, intente de nuevo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }
}
