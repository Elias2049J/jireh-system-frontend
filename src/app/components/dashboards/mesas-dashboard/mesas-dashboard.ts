import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MesaDTO } from '../../../models/mesa.dto';
import { MesaService } from '../../../services/mesa-service';
import { CommonModule, AsyncPipe } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-mesas-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './mesas-dashboard.html',
  styleUrl: './mesas-dashboard.scss'
})
export class MesasDashboard implements OnInit {
  private _mesas = new BehaviorSubject<MesaDTO[]>([]);
  mesas$: Observable<MesaDTO[]> = this._mesas.asObservable();
  showForm: boolean = false;
  actionType: 'add' | 'edit' | 'delete' | null = null;
  selectedMesa: MesaDTO | null = null;
  mesaForm: FormGroup;

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'number', header: 'Número' },
    { field: 'free', header: 'Libre' },
    { field: 'paid', header: 'Pagada' },
    { field: 'activatedAt', header: 'Activada' }
  ];

  constructor(private mesaService: MesaService, private fb: FormBuilder, private notificationService: NotificationService) {
    this.mesaForm = this.fb.group({
      number: ['', Validators.required],
      free: [true, Validators.required],
      paid: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMesas();
  }

  loadMesas(): void {
    this.mesaService.getAll().subscribe({
      next: (data) => {
        this._mesas.next(data);
      },
      error: (err) => {
        console.error('Error cargando mesas:', err);
        this.notificationService.error('No se pudieron cargar las mesas');
      }
    });
  }

  deleteMesa(mesa: MesaDTO): void {
    if (!mesa.id) return;
    if (confirm(`¿Está seguro de eliminar la mesa número ${mesa.number}?`)) {
      this.mesaService.delete(mesa.id).subscribe({
        next: (ok) => {
          if (ok) {
            this.loadMesas();
            this.notificationService.success('Mesa eliminada correctamente');
          } else {
            this.notificationService.error('No se pudo eliminar la mesa');
          }
        },
        error: (err) => {
          this.notificationService.error('No se pudo eliminar la mesa');
        }
      });
    }
  }

  handleAction(type: 'add' | 'edit' | 'delete', mesa?: MesaDTO) {
    this.actionType = type;
    this.showForm = type === 'add' || type === 'edit';
    if ((type === 'edit' || type === 'delete') && mesa) {
      this.selectedMesa = mesa;
      if (type === 'edit') {
        this.mesaForm.patchValue({
          number: mesa.number,
          free: mesa.free,
          paid: mesa.paid
        });
      }
      if (type === 'delete') {
        this.deleteMesa(mesa);
      }
    } else if (type === 'add') {
      this.mesaForm.reset({ number: '', free: true, paid: false });
      this.selectedMesa = null;
    }
  }

  cancelAction(): void {
    this.actionType = null;
    this.showForm = false;
    this.selectedMesa = null;
  }

  submitMesa() {
    if (this.mesaForm.invalid) return;
    const mesaData = this.mesaForm.value;
    if (this.actionType === 'add') {
      this.mesaService.create(mesaData).subscribe({
        next: () => {
          this.loadMesas();
          this.showForm = false;
          this.notificationService.success('La mesa se registró correctamente');
        },
        error: (err) => {
          this.notificationService.error('No se pudo registrar la mesa');
        }
      });
    } else if (this.actionType === 'edit' && this.selectedMesa) {
      const updatedMesa = { ...this.selectedMesa, ...mesaData };
      this.mesaService.update(updatedMesa).subscribe({
        next: () => {
          this.loadMesas();
          this.showForm = false;
          this.notificationService.success('La mesa se actualizó correctamente');
        },
        error: (err) => {
          this.notificationService.error('No se pudo actualizar la mesa');
        }
      });
    }
  }

}
