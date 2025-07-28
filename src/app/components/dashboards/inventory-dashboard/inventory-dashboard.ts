import { Component } from '@angular/core';
import {InventoryService} from '../../../services/inventory-service';
import {SupplyModel} from '../../../models/supply.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {LotModel} from '../../../models/lot.model';
import {AsyncPipe} from '@angular/common';
import {Search} from '../../search/search';
import {SupplyForm} from '../../forms/supply-form/supply-form';

@Component({
  selector: 'app-inventory-dashboard',
  imports: [
    AsyncPipe,
    Search,
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

  constructor(
    private inventoryService: InventoryService) {
  }

  handleAction(type: 'add' | 'edit' | 'delete') {
    this.actionType = type;
    this.showForm = true;
  }

  columns = [
    { field: 'id', header: 'Codigo' },
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Decripcion' },
    { field: 'unitCost', header: 'Precio Unitario' },
    { field: 'unit', header: 'Medida' },
    { field: 'stock', header: 'Cantidad' }
  ];

  ngOnInit(): void {
    this.loadInventory();
  }

  //creates a supply using the invetoryService method
  regSupply(supplyData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(supplyData);
    const newSupply = {
      id: null,
      name: supplyData['name'],
      description: supplyData['description'],
      unitCost: parseInt(supplyData['unitCost']),
      unit: supplyData['unit'],
      stock: parseInt(supplyData['stock'])};
    console.log(newSupply);
    this.inventoryService.createSupply(newSupply).subscribe({
      next: (createdSupply) => {
        console.info('New product created successfully ', createdSupply);
        this.loadSupplies();
      },
      error: (err) => {
        console.error(`Error creating supply: ${newSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //creates a supply using the invetoryService method
  updateSupply(supplyData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(supplyData);
    const newSupply = {
      id: null,
      name: supplyData['name'],
      description: supplyData['description'],
      unitCost: parseInt(supplyData['unitCost']),
      unit: supplyData['unit'],
      stock: parseInt(supplyData['stock'])};
    console.log(newSupply);
    this.inventoryService.createSupply(newSupply).subscribe({
      next: (createdSupply) => {
        console.info('Supply updated successfully ', createdSupply);
        this.loadSupplies();
      },
      error: (err) => {
        console.error(`Error updating supply: ${newSupply.name} in InventoryDashboard`, err);
      }
    });
  }

  //Loads the menus from the api using getAllByMenyId method from service
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
