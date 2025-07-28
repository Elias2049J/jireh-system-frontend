import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-supply-form',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './supply-form.html',
  styleUrl: './supply-form.scss'
})
export class SupplyForm {
  @Input() actionType: 'add' | 'edit' | null = null;
  @Output() dataEntered = new EventEmitter<any>();

  productDescControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
    Validators.minLength(6),
    Validators.pattern(/^[a-zA-Z \s]+$/)
  ]);

  productPriceControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)
  ]);

  productAvailable: boolean | undefined;

  emitData(): void {
    const data = {
      desc: this.productDescControl.value,
      price: this.productPriceControl.value,
      available: this.productAvailable
    }
    this.dataEntered.emit(data);
  }

}
