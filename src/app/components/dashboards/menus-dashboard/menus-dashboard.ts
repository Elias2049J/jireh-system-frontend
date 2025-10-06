import {Component, OnInit, signal, WritableSignal, ChangeDetectorRef} from '@angular/core';
import {MenuService} from '../../../services/menu-service';
import {MenuForm} from '../../forms/menu-form/menu-form';
import {ProductForm} from '../../forms/product-form/product-form';
import {CommonModule} from '@angular/common';
import {Menu, PrintArea} from '../../../models/menu.model';
import {Product, ProductSubType, ProductType} from '../../../models/product.model';
import {BehaviorSubject} from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { ProductService } from '../../../services/product-service';
import { AsyncPipe } from '@angular/common';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';
import {OptionsDashboard} from '../options-dashboard/options-dashboard';

@Component({
  selector: 'app-menus-dashboard',
  imports: [MenuForm, ProductForm, CommonModule, AsyncPipe, FormsModule, OptionsDashboard],
  templateUrl: './menus-dashboard.html',
  styleUrl: './menus-dashboard.scss'
})
export class MenusDashboard implements OnInit {
  private _menus = new BehaviorSubject<Menu[]>([]);
  menus$ = this._menus.asObservable();

  // signals
  isLoading: WritableSignal<boolean> = signal(false);
  allProducts: WritableSignal<Product[]> = signal([]);
  filteredProducts: WritableSignal<Product[]> = signal([]);

  showForm: boolean = false;
  showProductForm: boolean = false;
  productActionType: 'add' | 'edit' | null = null;
  selectedProduct: Product | null = null;
  editMenu: Menu | null = null;
  showEditForm: boolean = false;
  showAllProducts: boolean = false;
  searchTerm: string = '';
  selectedMenu: Menu | null = null;

  constructor(
    private menuService: MenuService,
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(){
    this.loadMenus();
  }

  //loads the menus from the api using the getAll method from service
  loadMenus(): void{
    this.menuService.getAll().subscribe({
      next: (data) => {
        this._menus.next(data);
        console.log('Received menus:', data);
      },
      error: (err) => {
        console.log('Error loading menus', err);
      }
    });
  }

  onDataEntered(menuData: {[key: string]: any}): void {
    this.showForm = false;
    const newMenu: Menu = {
      idMenu: null,
      name: menuData['name'],
      printArea: PrintArea[menuData['preparationArea'] as keyof typeof PrintArea]
    };
    console.log(newMenu);
    this.menuService.create(newMenu).subscribe({
      next: (createdMenu) => {
        console.info('New menu created successfully:', createdMenu);
        this.loadMenus();
      },
      error: (err) => {
        console.error(`Error creating menu: ${newMenu.name} in menusDashboard`, err);
      }
    });
  }

  onEditDataEntered(menuData: {[key: string]: any}): void {
    if (!this.editMenu) return;
    const updatedMenu: Menu = {
      ...this.editMenu,
      name: menuData['name'],
      printArea: menuData['preparationArea']
    };
    this.menuService.update(updatedMenu).subscribe({
      next: (result) => {
        console.log(`Menu actualizado: ${result}`)
        this.notificationService.success('Menú actualizado correctamente');
        this.showEditForm = false;
        this.editMenu = null;
        this.loadMenus();
      },
      error: (err) => {
        console.error(`Error actualizando menu: ${err}`);
        this.notificationService.error('Error actualizando el menú');
        this.showEditForm = false;
        this.editMenu = null;
      }
    });
  }


  // Seleccionar un menú en la columna izquierda y cargar sus productos
  selectMenu(menu: Menu) {
    this.selectedMenu = menu;
    this.showAllProducts = false;
    // Resetear búsqueda y señales
    this.searchTerm = '';
    this.allProducts.set([]);
    this.filteredProducts.set([]);
    if (!menu || menu.idMenu === null) return;
    this.isLoading.set(true);
    this.productService.getAllByMenuId(menu.idMenu).subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.filteredProducts.set(products);
        this.isLoading.set(false);
        // forzar detección si es necesario
        try { this.cd.detectChanges(); } catch(e) { /* ignore */ }
      },
      error: (err) => {
        console.error('Error loading products for menu', menu, err);
        this.allProducts.set([]);
        this.filteredProducts.set([]);
        this.isLoading.set(false);
        this.notificationService.error('No se pudieron cargar los productos del menú');
      }
    });
  }

  // Mostrar todos los productos (usado por el botón en la toolbar)
  onShowAllProducts() {
    this.showAllProducts = true;
    // al mostrar la lista completa, no debe quedar ningún menú seleccionado
    this.selectedMenu = null;
    this.searchTerm = '';
    this.isLoading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.filteredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching all products:', err);
        this.allProducts.set([]);
        this.filteredProducts.set([]);
        this.isLoading.set(false);
        this.notificationService.error('Error al obtener los productos');
      }
    });
  }


  handleProductAction(type: 'add' | 'edit', product?: Product) {
    this.productActionType = type;
    if (type === 'edit' && product) {
      this.selectedProduct = product;
    } else {
      this.selectedProduct = null;
    }
    this.showProductForm = true;
  }

  // Crear producto a partir de los datos del formulario
  createProduct(productData: {[key:string]: any}) {
    this.showProductForm = false;
    this.productActionType = null;

    // Construir objeto Product con el nuevo formato
    const newProd: Product = {
      type: ProductSubType.simple,
      productType: ProductType.SIMPLE,
      idProduct: null,
      code: null,
      name: productData['name'],
      prefix: productData['prefix'],
      price: parseFloat(productData['price']),
      available: true,
      idMenu: this.selectedMenu ? this.selectedMenu.idMenu : null,
      optionLists: productData['optionLists'] || []
    } as Product;
    console.log(newProd);

    this.productService.create(newProd).subscribe({
      next: () => {
        if (this.showAllProducts) this.onShowAllProducts(); else if (this.selectedMenu) this.selectMenu(this.selectedMenu);
      },
      error: (err) => {
        console.error('Error creating product', err);
        this.notificationService.error('Error al crear producto');
      }
    });
  }

  // Actualizar producto
  updateProduct(productData: {[key:string]: any}) {
    this.showProductForm = false;
    this.productActionType = null;
    if (!this.selectedProduct) return;
    const updated: Product = {
      idProduct: this.selectedProduct.idProduct,
      code: this.selectedProduct.code,
      idMenu: this.selectedProduct.idMenu,
      name: productData['name'],
      prefix: productData['prefix'],
      price: parseFloat(productData['price']),
      available: productData['available'] !== undefined ? productData['available'] : this.selectedProduct.available,
      type: productData['type'] || this.selectedProduct.type,
      productType: productData['productType'] || this.selectedProduct.productType,
      optionLists: productData['optionLists'] || this.selectedProduct.optionLists || []
    };
    this.productService.update(updated).subscribe({
      next: () => {
        this.notificationService.success('Producto actualizado correctamente');
        if (this.showAllProducts) this.onShowAllProducts(); else if (this.selectedMenu) this.selectMenu(this.selectedMenu);
        this.selectedProduct = null;
      },
      error: (err) => {
        console.error('Error updating product', err);
        this.notificationService.error('Error al actualizar producto');
      }
    });
  }

  deleteProduct(item: Product) {
    if (!item || item.idProduct == null) return;
    Swal.fire({
      title: `¿Eliminar producto ${item.name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(item.idProduct).subscribe({
          next: () => {
            this.notificationService.success('Producto eliminado correctamente');
            if (this.showAllProducts) this.onShowAllProducts(); else if (this.selectedMenu) this.selectMenu(this.selectedMenu);
          },
          error: (err) => {
            console.error('Error al eliminar producto', err);
            this.notificationService.error('Error al eliminar el producto');
          }
        });
      }
    });
  }

  // Handler para el submit del product-form
  onProductFormSubmit(productData: {[key:string]: any}) {
    if (this.productActionType === 'add') {
      this.createProduct(productData);
    } else if (this.productActionType === 'edit') {
      this.updateProduct(productData);
    }
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
    const q = term.trim();
    if (!q) {
      // si hay menú seleccionado, recargar sus productos; si no, limpiar
      if (this.selectedMenu && this.selectedMenu.idMenu) {
        // recargar productos del menú
        this.selectMenu(this.selectedMenu);
      } else {
        this.filteredProducts.set([]);
      }
      return;
    }

    // Buscar globalmente: obtener todos los productos y filtrar
    this.isLoading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        const lower = q.toLowerCase();
        const filtered = (products || []).filter(p =>
          (p.name?.toLowerCase().includes(lower) ||
            (p.code && p.code.toLowerCase().includes(lower)))
        );
        this.allProducts.set(products);
        this.filteredProducts.set(filtered);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.isLoading.set(false);
        this.notificationService.error('Error buscando productos');
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    if (this.showAllProducts) {
      // volver a cargar todos los productos
      this.onShowAllProducts();
      return;
    }
    if (this.selectedMenu && this.selectedMenu.idMenu) {
      this.selectMenu(this.selectedMenu);
      return;
    }
    this.filteredProducts.set([]);
  }

  deleteSelectedMenu() {
    if (!this.selectedMenu || !this.selectedMenu.idMenu) return;
    const menu = this.selectedMenu;
    Swal.fire({
      title: `¿Eliminar menú ${menu.name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.delete(menu.idMenu!).subscribe({
          next: (ok) => {
            if (ok) {
              this.notificationService.success('Menú eliminado correctamente');
              this.loadMenus();
              // limpiar selección y productos mostrados
              this.selectedMenu = null;
              this.allProducts.set([]);
              this.filteredProducts.set([]);
              this.showAllProducts = false;
            } else {
              this.notificationService.error('No se pudo eliminar el menú');
            }
          },
          error: (err) => {
            console.error('Error deleting menu', err);
            this.notificationService.error('Error al eliminar el menú');
          }
        });
      }
    });
  }
}
