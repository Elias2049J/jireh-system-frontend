import { Component, OnInit } from '@angular/core';
import { Search } from '../../search/search';
import {Product, ProductSubType, ProductType} from '../../../models/product.model';
import {ProductService} from '../../../services/product-service';
import {ProductForm} from '../../forms/product-form/product-form';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AsyncPipe, CommonModule} from '@angular/common';

@Component({
  selector: 'app-products-dashboard',
  imports: [Search, ProductForm, AsyncPipe, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './products-dashboard.html',
  styleUrl: './products-dashboard.scss'
})
export class ProductsDashboard implements OnInit{
  private _products = new BehaviorSubject<Product[]>([]);
  idMenu: string | null = null;

  products$: Observable<Product[]> = this._products.asObservable();
  showForm: boolean = false;
  actionType: 'add' | 'edit' | 'delete' | null = null;
  selectedProduct: Product | null = null;

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
    { field: 'id', header: 'Id' },
    { field: 'code', header: 'Codigo' },
    { field: 'name', header: 'Nombre' },
    { field: 'alias', header: 'Alias' },
    { field: 'price', header: 'Precio' },
    { field: 'available', header: 'Disponible' },
    { field: 'productType', header: 'Tipo' }
  ];

  //sets an actionType to an action
  handleAction(type: 'add' | 'edit' | 'delete') {
    this.actionType = type;
    this.showForm = true;
  }

  // Cancel and close the form
  cancelAction(): void {
    this.actionType = null;
    this.showForm = false;
    this.selectedProduct = null;
  }

  //creates a product using the productService method
  createProduct(productData: { [key: string]: any; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(productData);
    const prodType = productData['type'] === ProductSubType.simple ? ProductType.SIMPLE : ProductType.COMPUESTO;
    let newProd: Product;
    if (prodType === ProductType.SIMPLE) {
      newProd = {
        type: ProductSubType.simple,
        productType: ProductType.SIMPLE,
        idProduct: null,
        code: null,
        name: productData['name'],
        alias: productData['alias'],
        price: parseFloat(productData['price']),
        available: true,
        idMenu: parseInt(this.idMenu as any),
        idsSimpleProducts: null
      };
    } else {
      newProd = {
        type: ProductSubType.composed,
        productType: ProductType.COMPUESTO,
        idProduct: null,
        code: null,
        name: null,
        alias: productData['alias'],
        price: null,
        available: true,
        idMenu: parseInt(this.idMenu as any),
        idsSimpleProducts: [productData['prod1'], productData['prod2']]
      };
    }
    console.log(newProd);
    this.productService.create(newProd).subscribe({
      next: (createdProd) => {
        console.info('New product created successfully ', createdProd);
        this.loadProducts();
      },
      error: (err) => {
        console.error(`Error creating product: ${newProd.name} in productsDashboard`, err);
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

  deleteProduct(item: Product) {
    if (confirm(`¿Está seguro de eliminar el producto: ${item.name}?`)) {
      this.productService.delete(item.idProduct).subscribe({
        next: () => {
          console.info('Producto eliminado con éxito');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
        }
      });
    }
  }

  updateProduct(productData?: any) {
    if (productData) {
      const updatedProduct = {
        ...productData,
        id: this.selectedProduct?.idProduct,
        idMenu: parseInt(this.idMenu as any)
      };

      this.productService.update(updatedProduct).subscribe({
        next: () => {
          console.info('Producto actualizado con éxito');
          this.loadProducts();
          this.cancelAction();
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
        }
      });
    }
  }
}
