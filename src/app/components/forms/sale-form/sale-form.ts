import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sale-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.scss'
})
export class SaleForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Output() exitEvent = new EventEmitter<void>();
  @Output() dataEntered = new EventEmitter<any>();

  saleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.saleForm = this.fb.group({
      totalPay: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  emitData(): void {
    if (this.saleForm.valid) {
      this.dataEntered.emit(this.saleForm.value);
    }
  }

  emitExitEvent(): void {
    this.exitEvent.emit();
  }
}
