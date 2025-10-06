import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product, ProductSubType, ProductType} from '../../../models/product.model';
import {ProductService} from '../../../services/product-service';
import {CommonModule} from "@angular/common";
import {OptionListDTO} from "../../../models/option-list.dto";

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Input() productData: Product | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  productForm: FormGroup;
  allOptionLists = signal<OptionListDTO[]>([]);
  optionListControls: FormControl[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.pattern(/^[\w\-.ñÑ/\s0-9]+$/)
      ]],
      prefix: ['', [
        Validators.maxLength(30)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)
      ]],
      available: [true]
    });
  }

  ngOnInit() {
    this.productService.getAllOptionLists().subscribe({
      next: (data) => {
        this.allOptionLists.set(data);
      },
      error: (err) => {
        console.error('Error cargando option lists:', err);
      }
    });

    if (this.actionType === 'edit' && this.productData) {
      this.productForm.patchValue({
        name: this.productData.name,
        prefix: this.productData.prefix,
        price: this.productData.price,
        available: this.productData.available
      });

      // Cargar listas de opciones previamente seleccionadas
      if (this.productData.optionLists && this.productData.optionLists.length > 0) {
        this.productData.optionLists.forEach(optionList => {
          const control = new FormControl(optionList.idOptionList);
          this.optionListControls.push(control);
        });
      } else {
        // Si no hay listas de opciones, agregar al menos una vacía
        this.addOptionListSlot();
      }
    } else {
      // Por defecto agregar un slot vacío
      this.addOptionListSlot();
    }
  }

  addOptionListSlot(): void {
    const control = new FormControl(null);
    this.optionListControls.push(control);
  }

  removeOptionListSlot(index: number): void {
    this.optionListControls.splice(index, 1);
  }

  getSelectedOptionLists(): OptionListDTO[] {
    const selectedOptionListIds = this.optionListControls
      .map(control => control.value)
      .filter(id => id !== null);

    return this.allOptionLists()
      .filter(optionList => selectedOptionListIds.includes(optionList.idOptionList));
  }

  submit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData = {
        ...formValue,
        type: ProductSubType.simple,
        productType: ProductType.SIMPLE,
        optionLists: this.getSelectedOptionLists()
      };

      this.dataEntered.emit(productData);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
