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
  templateUrl: './supply-form.html',
  styleUrl: './supply-form.scss'
})
export class SupplyForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Input() supplyData: SupplyModel | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  supplyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.supplyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      unitType: ['', Validators.required],
      minStock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.actionType === 'edit' && this.supplyData) {
      this.supplyForm.patchValue(this.supplyData);
    }
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
