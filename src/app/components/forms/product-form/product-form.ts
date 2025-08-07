import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product} from '../../../models/product.model';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Input() productData: Product | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      desc: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z \s]+$/)
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
    if (this.actionType === 'edit' && this.productData) {
      this.productForm.patchValue(this.productData);
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
