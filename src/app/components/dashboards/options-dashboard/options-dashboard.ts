import {Component, OnInit, signal, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../../services/product-service';
import { OptionListDTO } from '../../../models/option-list.dto';
import { OptionDTO } from '../../../models/option.dto';
import { showSuccessAlert, showErrorAlert } from '../../shared/alerts';
import {FormsModule} from '@angular/forms';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-options-dashboard',
  imports: [
    FormsModule
  ],
  templateUrl: './options-dashboard.html',
  styleUrl: './options-dashboard.scss'
})
export class OptionsDashboard implements OnInit {
  allOptionLists = signal<OptionListDTO[]>([])
  allOptions = signal<OptionDTO[]>([])
  allProducts = signal<Product[]>([])

  @ViewChild('optionGroupModal') optionGroupModal: any;
  @ViewChild('optionModal') optionModal: any;

  optionGroupDto: Partial<OptionListDTO> = { name: '', minSelectable: 0, maxSelectable: 1, options: [] };
  optionDto: Partial<OptionDTO> = {
    name: '',
    alias: '',
    additionalPrice: 0,
    defaultSelected: false,
    idOptionList: 0,
    idProduct: null
  };

  constructor(
    private modalService: NgbModal,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadOptionsGroups();
    this.loadOptions();
    this.loadProducts();
  }

  openOptionGroupModal() {
    this.optionGroupDto = { name: '', minSelectable: 0, maxSelectable: 1, options: [] };
    this.modalService.open(this.optionGroupModal, { centered: true });
  }

  openOptionModal(idOptionList: number) {
    this.optionDto = {
      name: '',
      alias: '',
      additionalPrice: 0,
      defaultSelected: false,
      idOptionList: idOptionList,
      idProduct: null
    };
    this.modalService.open(this.optionModal, { centered: true });
  }

  loadOptionsGroups() {
    this.productService.getAllOptionLists().subscribe({
      next: data => {
        console.log(data);
        this.allOptionLists.set(data);
      },
      error: err => {
        console.log(`No se pudo cargar las optionList ${err}`);
      }
    });
  }

  loadOptions() {
    this.productService.getAllOptions().subscribe({
      next: data => {
        console.log(data);
        this.allOptions.set(data);
      },
      error: err => {
        console.log(`No se pudo cargar las options ${err}`);
      }
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: data => {
        console.log('Productos cargados:', data);
        this.allProducts.set(data);
      },
      error: err => {
        console.log(`No se pudo cargar los productos ${err}`);
        showErrorAlert('Error al cargar los productos');
      }
    });
  }

  submitOptionGroup(modal: any) {
    this.productService.createOptionList(this.optionGroupDto as OptionListDTO).subscribe({
      next: () => {
        showSuccessAlert('Grupo de opciones creado correctamente');
        modal.close();
      },
      error: (err) => {
        showErrorAlert(`Error al crear grupo de opciones ${err}`);
      }
    });
  }

  submitOption(modal: any) {
    this.productService.createOption(this.optionDto as OptionDTO).subscribe({
      next: () => {
        showSuccessAlert('Opción creada correctamente');
        modal.close();
      },
      error: (err) => {
        showErrorAlert(`Error al crear opción ${err}`);
      }
    });
  }
}
