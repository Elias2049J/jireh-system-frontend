import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SupplyModel} from "../../../models/supply.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-supply-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './supply-form.html'
})
export class SupplyForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Input() supplyData: SupplyModel | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  supplyForm: FormGroup;

  showCustomType: boolean = false;
  showCustomUnitType: boolean = false;

  constructor(private fb: FormBuilder) {
    this.supplyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      unitType: ['', Validators.required],
      minStock: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.actionType === 'edit' && this.supplyData) {
      this.supplyForm.patchValue(this.supplyData);

      const predefinedTypes = ['INGREDIENT', 'UTENSIL', 'CLEANING', 'CONSUMABLE', 'TOOL'];
      const predefinedUnitTypes = ['kg', 'g', 'l', 'ml', 'unidad'];

      if (this.supplyData.type && !predefinedTypes.includes(this.supplyData.type)) {
        this.showCustomType = true;
      }

      if (this.supplyData.unitType && !predefinedUnitTypes.includes(this.supplyData.unitType)) {
        this.showCustomUnitType = true;
      }
    }
  }

  toggleCustomType(): void {
    this.showCustomType = true;
    this.supplyForm.get('type')?.setValue('');
  }

  returnToTypeSelect(): void {
    this.showCustomType = false;
    this.supplyForm.get('type')?.setValue('');
  }

  toggleCustomUnitType(): void {
    this.showCustomUnitType = true;
    this.supplyForm.get('unitType')?.setValue('');
  }

  returnToUnitTypeSelect(): void {
    this.showCustomUnitType = false;
    this.supplyForm.get('unitType')?.setValue('');
  }

  submit(): void {
    if (this.supplyForm.valid) {
      this.dataEntered.emit(this.supplyForm.value);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
