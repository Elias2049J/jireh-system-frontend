import { Component, OnInit } from '@angular/core';
import { Search } from '../../search/search';
import {Product} from '../../../models/product.model';
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
    { field: 'id', header: 'Codigo' },
    { field: 'desc', header: 'Descripcion' },
    { field: 'price', header: 'Precio' },
    { field: 'available', header: 'Disponible' }
  ];

  //sets an actionType to an action
  handleAction(type: 'add' | 'edit' | 'delete') {
    this.actionType = type;
    this.showForm = true;
  }

  // Método para cancelar y cerrar el formulario
  cancelAction(): void {
    this.actionType = null;
    this.showForm = false;
    this.selectedProduct = null;
  }

  //creates a product using the productService method
  createProduct(productData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(productData);
    const newProd = {id: null as any, desc: productData['desc'], price: parseFloat(productData['price']), available: true, idMenu: parseInt(this.idMenu as any)};
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

  deleteProduct(item: Product) {
    if (confirm(`¿Está seguro de eliminar el producto: ${item.desc}?`)) {
      this.productService.delete(item.id).subscribe({
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
      // Si recibimos datos del formulario, actualizamos el producto
      const updatedProduct = {
        ...productData,
        id: this.selectedProduct?.id,
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
    } else {
      // Si no recibimos datos, simplemente preparamos para la edición
      // En una implementación real, aquí se cargaría el producto seleccionado
      // this.selectedProduct = productToEdit;
    }
  }
}
