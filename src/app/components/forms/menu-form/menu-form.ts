import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-menu-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './menu-form.html',
  styleUrl: './menu-form.scss'
})
export class MenuForm {
  @Output() nameEntered = new EventEmitter<string>();
  menuNameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z\s]+$/)
  ]);

  //emits the name entered to his father component
  emitName(): void {
    this.nameEntered.emit(this.menuNameControl.value ?? '')
  }
}
