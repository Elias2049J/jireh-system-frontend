import {Component, OnInit} from '@angular/core';
import {InventoryService} from '../../../services/inventory-service';
import {SupplyModel} from '../../../models/supply.model';
import {LotModel} from '../../../models/lot.model';
import {SupplyForm} from '../../forms/supply-form/supply-form';
import { signal } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-inventory-dashboard',
  imports: [
    SupplyForm
  ],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.scss'
})
export class InventoryDashboard implements OnInit {
  supplies = signal<SupplyModel[]>([]);
  lots = signal<LotModel[]>([]);
  showForm = signal(false);
  formAction = signal<'add' | 'edit'>('add');
  selectedSupply = signal<SupplyModel | null>(null);

  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {
  }

  handleAction(type: 'add' | 'edit' | 'delete', supply?: SupplyModel) {
    this.formAction.set(type === 'delete' ? 'edit' : type);
    this.showForm.set(true);
    if (type === 'edit' || type === 'delete') {
      if (supply) {
        this.selectedSupply.set(supply);
      }
    }
  }

  cancelAction(): void {
    this.formAction.set('add');
    this.showForm.set(false);
    this.selectedSupply.set(null);
  }

  ngOnInit(): void {
    this.loadInventory();
  }

  //creates a supply using the invetoryService method
  regSupply(supplyData: { [key: string]: string; }) {
    this.showForm.set(false);
    this.formAction.set('add');
    console.log(supplyData);
    const newSupply: SupplyModel = {
      idSupply: null,
      name: supplyData['name'],
      type: supplyData['type'],
      unitType: supplyData['unitType'],
      minStock: parseInt(supplyData['minStock']),
      stock: parseInt(supplyData['stock'])
    };
    console.log(newSupply);
    this.inventoryService.createSupply(newSupply).subscribe({
      next: (createdSupply) => {
        this.notificationService.success('Insumo creado correctamente');
        this.loadSupplies();
      },
      error: (err) => {
        this.notificationService.error('Error al crear el insumo');
        console.error(`Error creating supply: ${newSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //updates a supply using the inventoryService method
  updateSupply(supplyData: { [key: string]: string; }) {
    this.showForm.set(false);
    this.formAction.set('add');
    console.log(supplyData);

    if (!this.selectedSupply()) {
      this.notificationService.warning('No hay insumo seleccionado para actualizar');
      console.error('No supply selected for update');
      return;
    }
    const updatedSupply: SupplyModel = {
      idSupply: this.selectedSupply()!.idSupply,
      name: supplyData['name'],
      type: supplyData['type'],
      unitType: supplyData['unitType'],
      minStock: parseInt(supplyData['minStock']),
      stock: parseInt(supplyData['stock']),
    };

    console.log(updatedSupply);
    this.inventoryService.updateSupply(updatedSupply).subscribe({
      next: (response) => {
        this.notificationService.success('Insumo actualizado correctamente');
        this.loadSupplies();
        this.selectedSupply.set(null);
      },
      error: (err) => {
        this.notificationService.error('Error al actualizar el insumo');
        console.error(`Error updating supply: ${updatedSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //Loads inventory from the api
  loadInventory(): boolean {
    return this.loadSupplies() && this.loadLots();
  }

  loadSupplies(): boolean {
    this.inventoryService.getAllSupplies().subscribe({
      next: (data) => {
        this.supplies.set(data);
        this.notificationService.info('Lista de insumos actualizada');
        console.info("Received supplies: ", data);
        return true;
      },
      error: (err) => {
        this.notificationService.error('Error al cargar los insumos');
        console.error(`Error loading supplies: ${err}`);
        return false;
      }
    });
    return false;
  }

  loadLots():boolean {
    const today = new Date();
    const twoMonthsBefore = new Date(today);
    twoMonthsBefore.setMonth(today.getMonth() - 2);
    this.inventoryService.getLotsBetweenDates(today.toLocaleDateString('es-PE'), twoMonthsBefore.toLocaleDateString('es-PE')
    ).subscribe({
      next: (data) => {
        this.lots.set(data);
        this.notificationService.info('Lista de lotes actualizada');
        console.info("Received lots: ", data);
        return true;
      },
      error: (err) => {
        this.notificationService.error('Error al cargar los lotes');
        console.error(`Error loading lots: ${err}`);
        return false;
      }
    });
    return false;
  }
}
