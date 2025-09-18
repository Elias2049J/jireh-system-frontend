import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product, ProductType, ProductSubType} from '../../../models/product.model';
import {ProductService} from '../../../services/product-service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Input() productData: Product | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  productForm: FormGroup;
  productsSimple: Product[] = [];
  selectedType: string = 'simple';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      type: ['simple', Validators.required],
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z\-.ñÑ/ \s]+$/)
      ]],
      alias: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z\-.ñÑ/ \s]+$/)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)
      ]],
      available: [true],
      prod1: [null],
      prod2: [null]
    });
  }

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productsSimple = products.filter(p => p.type === ProductSubType.simple);
      },
      error: (err) => {
        console.error('Error cargando productos simples:', err);
        this.productsSimple = [];
      }
    });

    this.productForm.get('type')?.valueChanges.subscribe((type) => {
      this.selectedType = type;
      if (type === ProductSubType.composed) {
        this.productForm.get('name')?.disable();
        this.productForm.get('prod1')?.setValidators([Validators.required]);
        this.productForm.get('prod2')?.setValidators([Validators.required]);
        this.productForm.get('price')?.disable();
      } else {
        this.productForm.get('name')?.enable();
        this.productForm.get('prod1')?.clearValidators();
        this.productForm.get('prod2')?.clearValidators();
        this.productForm.get('prod1')?.setValue(null);
        this.productForm.get('prod2')?.setValue(null);
        this.productForm.get('price')?.enable();
      }
      this.productForm.get('prod1')?.updateValueAndValidity();
      this.productForm.get('prod2')?.updateValueAndValidity();
    });

    // Actualizar el precio automáticamente si es compuesto
    this.productForm.get('prod1')?.valueChanges.subscribe(() => {
      this.updateComposedPrice();
    });
    this.productForm.get('prod2')?.valueChanges.subscribe(() => {
      this.updateComposedPrice();
    });

    if (this.actionType === 'edit' && this.productData) {
      this.productForm.patchValue(this.productData);
      this.selectedType = this.productData.type;
    }
  }

  updateComposedPrice(): void {
    if (this.productForm.get('type')?.value === ProductSubType.composed) {
      const prod1Id = this.productForm.get('prod1')?.value;
      const prod2Id = this.productForm.get('prod2')?.value;
      let price = 0;
      if (prod1Id) {
        const prod1 = this.productsSimple.find(p => p.idProduct === prod1Id);
        if (prod1 && prod1.price) price += prod1.price;
      }
      if (prod2Id) {
        const prod2 = this.productsSimple.find(p => p.idProduct === prod2Id);
        if (prod2 && prod2.price) price += prod2.price;
      }
      this.productForm.get('price')?.setValue(price);
    }
  }

  submit(): void {
    if (this.productForm.valid) {
      this.dataEntered.emit(this.productForm.value);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
