import { Component, OnInit } from '@angular/core';
import { Table } from '../../table/table';
import { Search } from '../../search/search';
import {Product} from '../../../models/product.model';
import {ProductService} from '../../../services/product-service';
import {ProductForm} from '../../forms/product-form/product-form';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-products-dashboard',
  imports: [Search, Table, ProductForm, AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './products-dashboard.html',
  styleUrl: './products-dashboard.scss'
})
export class ProductsDashboard implements OnInit{
  private _products = new BehaviorSubject<Product[]>([]);
  idMenu: string | null = null;

  products$: Observable<Product[]> = this._products.asObservable();
  showForm: boolean = false;
  actionType: 'add' | 'edit' | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.idMenu = params.get('idMenu');
    })
  }

  ngOnInit(): void {
    this.loadProducts();
    }

  columns = [
    { field: 'id', header: 'Codigo' },
    { field: 'desc', header: 'Descripcion' },
    { field: 'price', header: 'Precio' },
    { field: 'available', header: 'Disponible' }
  ];
  //sets an actionType to an action
  handleAction(type: 'add' | 'edit') {
    this.actionType = type;
    this.showForm = true;
  }

  //creates a product using the productService method
  createProduct(productData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(productData);
    const newProd = {id: null as any, desc: productData['desc'], price: parseFloat(productData['price']), available: undefined, idMenu: this.idMenu};
    console.log(newProd);
    this.productService.create(newProd).subscribe({
      next: (createdProd) => {
        console.info('New product created successfully ', createdProd);
        this.loadProducts();
      },
      error: (err) => {
        console.error(`Error creating product: ${newProd.desc} in productsDashboard`, err);
      }
    });
  }

  //Loads the menus from the api using getAllByMenyId method from service
  loadProducts(): void {
    if (this.idMenu !== null) {
      this.productService.getAllByMenuId(parseInt(this.idMenu)).subscribe({
        next: (data) => {
          this._products.next(data);
          console.info("Received products: ", data);
        },
        error: (err) => {
          console.error(`Error loading products: ${err}`);
        }
      });
    } else {
      console.error("Id menu is null at: loadProducts");
    }
  }
}
