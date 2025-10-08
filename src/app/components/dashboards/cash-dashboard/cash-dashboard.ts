import {Component, OnInit} from '@angular/core';
import {signal} from '@angular/core';
import {PaymentDTO} from '../../../models/payment.dto';
import {CashService} from '../../../services/cash-service';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ReportService} from '../../../services/report-service';
import { NotificationService } from '../../../services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cash-dashboard',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './cash-dashboard.html'
})
export class CashDashboard implements OnInit {
  ngOnInit(): void {
    this.loadSales();
    this.getTotalAmountToday();
  }

  constructor(
    private cashService: CashService,
    private reportService: ReportService,
    private notificationService: NotificationService) {
  }

  sales = signal<PaymentDTO[]>([]);
  todaySales = signal<PaymentDTO[]>([]);
  totalAmountToday = signal<number>(0);

  showForm: boolean = false;
  actionType: 'add' | 'edit' | 'delete' | null = null;

  loadSales(): void {
    this.cashService.getTodaySales().subscribe({
      next: (data) => {
        this.todaySales.set(data);
        this.sales.set(data);
        console.info("Received today sales:", data);
      },
      error: (err) => {
        console.error(`Error getting today sales: ${err}`);
      }
    });
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
        this.totalAmountToday.set(data['totalAmount']);
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
