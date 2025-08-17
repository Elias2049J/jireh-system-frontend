import { Component } from '@angular/core';
import {InventoryService} from '../../../services/inventory-service';
import {SupplyModel} from '../../../models/supply.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {LotModel} from '../../../models/lot.model';
import {AsyncPipe} from '@angular/common';
import {SupplyForm} from '../../forms/supply-form/supply-form';

@Component({
  selector: 'app-inventory-dashboard',
  imports: [
    AsyncPipe,
    SupplyForm
  ],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.scss'
})
export class InventoryDashboard {
  private _supplies = new BehaviorSubject<SupplyModel[]>([]);
  private _lots = new BehaviorSubject<LotModel[]>([]);
  dataSource: any;
  supplies$: Observable<SupplyModel[]> = this._supplies.asObservable();
  lots$: Observable<LotModel[]> = this._lots.asObservable();
  actionType: 'add' | 'edit' | 'delete' | null = null;
  showForm: boolean = false;
  selectedSupply: SupplyModel | null = null;

  constructor(
    private inventoryService: InventoryService) {
  }

  handleAction(type: 'add' | 'edit' | 'delete', supply?: SupplyModel) {
    this.actionType = type;
    this.showForm = true;

    if (type === 'edit' || type === 'delete') {
      if (supply) {
        this.selectedSupply = supply;
      }
    }
  }

  // Método para cancelar y cerrar el formulario
  cancelAction(): void {
    this.actionType = null;
    this.showForm = false;
    this.selectedSupply = null;
  }

  columns = [
    { field: 'idSupply', header: 'Código' },
    { field: 'name', header: 'Nombre' },
    { field: 'type', header: 'Tipo' },
    { field: 'unitType', header: 'Unidad' },
    { field: 'minStock', header: 'Stock Mínimo' }
  ];

  ngOnInit(): void {
    this.loadInventory();
  }

  //creates a supply using the invetoryService method
  regSupply(supplyData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(supplyData);
    const newSupply: SupplyModel = {
      idSupply: null,
      name: supplyData['name'],
      type: supplyData['type'],
      unitType: supplyData['unitType'],
      minStock: parseInt(supplyData['minStock'])
    };
    console.log(newSupply);
    this.inventoryService.createSupply(newSupply).subscribe({
      next: (createdSupply) => {
        console.info('New supply created successfully ', createdSupply);
        this.loadSupplies();
      },
      error: (err) => {
        console.error(`Error creating supply: ${newSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //updates a supply using the inventoryService method
  updateSupply(supplyData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(supplyData);

    if (!this.selectedSupply) {
      console.error('No supply selected for update');
      return;
    }

    const updatedSupply: SupplyModel = {
      idSupply: this.selectedSupply.idSupply,
      name: supplyData['name'],
      type: supplyData['type'],
      unitType: supplyData['unitType'],
      minStock: parseInt(supplyData['minStock'])
    };

    console.log(updatedSupply);
    this.inventoryService.updateSupply(updatedSupply).subscribe({
      next: (result) => {
        console.info('Supply updated successfully ', result);
        this.loadSupplies();
        this.selectedSupply = null;
      },
      error: (err) => {
        console.error(`Error updating supply: ${updatedSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //Loads inventory from the api
  loadInventory(): boolean {
    return this.loadSupplies() && this.loadLots();
  }

  loadSupplies(): boolean {
    if (this !== null) {
      this.inventoryService.getAllSupplies().subscribe({
        next: (data) => {
          this._supplies.next(data);
          console.info("Received supplies: ", data);
          return true;
        },
        error: (err) => {
          console.error(`Error loading supplies: ${err}`);
          return false;
        }
      });
    }
    return false;
  }

  loadLots():boolean {
    const today = new Date();
    const twoMonthsBefore = new Date(today);
    twoMonthsBefore.setMonth(today.getMonth() - 2);
    if (this !== null) {
      this.inventoryService.getLotsBetweenDates(today.toLocaleDateString('es-PE'), twoMonthsBefore.toLocaleDateString('es-PE')
    ).subscribe({
        next: (data) => {
          this._lots.next(data);
          console.info("Received lots: ", data);
          return true;
        },
        error: (err) => {
          console.error(`Error loading lots: ${err}`);
          return false;
        }
      });
    }
    return false;
  }
}
