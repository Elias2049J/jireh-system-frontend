import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-menu-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './menu-form.html',
  styleUrl: './menu-form.scss'
})
export class MenuForm implements OnInit {
  @Output() exitEvent = new EventEmitter<void>();
  @Output() nameEntered = new EventEmitter<string>();

  menuForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]]
    });
  }

  ngOnInit() {
    // Inicialización adicional si es necesaria
  }

  emitName(): void {
    if (this.menuForm.valid) {
      this.nameEntered.emit(this.menuForm.get('name')?.value);
    }
  }

  emitExitEvent(): void {
    this.exitEvent.emit();
  }
}
