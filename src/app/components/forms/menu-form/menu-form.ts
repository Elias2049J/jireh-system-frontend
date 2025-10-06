import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-menu-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './menu-form.html'
})
export class MenuForm implements OnInit {
  @Input() menu: any = null;
  @Output() exitEvent = new EventEmitter<void>();
  @Output() menuData = new EventEmitter<{[key: string]: any}>();

  menuForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      preparationArea: ['COCINA', Validators.required]
    });
  }

  ngOnInit() {
    if (this.menu) {
      this.menuForm.patchValue({
        name: this.menu.name,
        preparationArea: this.menu.printArea
      });
    }
  }

  emitData(): void {
    if (this.menuForm.valid) {
      this.menuData.emit(this.menuForm.value);
    }
  }

  emitExitEvent(): void {
    this.exitEvent.emit();
  }
}
