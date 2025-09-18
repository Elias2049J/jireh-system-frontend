import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('pass');
  const confirmPassword = control.get('confirmPass');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-form.html'
})
export class UserForm implements OnInit {
  @Input() actionType: 'add' | 'edit' | 'login' | null = null;
  @Input() userData: UserModel | null = null;
  @Output() dataEntered = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  userForm: FormGroup;
  isPasswordChanged: boolean = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', this.actionType !== 'login' ? Validators.required : []],
      role: [''],
      active: [true]
    }, { validators: this.actionType !== 'login' ? passwordMatchValidator : [] });
  }

  ngOnInit() {
    if (this.actionType === 'login') {
      this.userForm.get('role')?.clearValidators();
      this.userForm.get('confirmPass')?.clearValidators();
      this.userForm.get('role')?.updateValueAndValidity();
      this.userForm.get('confirmPass')?.updateValueAndValidity();
      this.userForm.removeValidators(passwordMatchValidator);
      this.userForm.updateValueAndValidity();
    } else if (this.actionType === 'add') {
      this.userForm.get('role')?.setValidators([Validators.required]);
      this.userForm.get('role')?.updateValueAndValidity();
    } else if (this.actionType === 'edit' && this.userData) {
      this.userForm.patchValue({
        name: this.userData.name,
        role: this.userData.role,
        active: this.userData.active
      });

      this.userForm.get('role')?.setValidators([Validators.required]);
      this.userForm.get('role')?.updateValueAndValidity();

      this.userForm.get('pass')?.clearValidators();
      this.userForm.get('pass')?.setValidators(Validators.minLength(6));
      this.userForm.get('pass')?.updateValueAndValidity();

      this.userForm.get('pass')?.valueChanges.subscribe(value => {
        this.isPasswordChanged = value && value.trim().length > 0;

        if (value && value.trim().length > 0) {
          this.userForm.get('confirmPass')?.setValidators([Validators.required]);
        } else {
          this.userForm.get('confirmPass')?.clearValidators();
        }
        this.userForm.get('confirmPass')?.updateValueAndValidity();
      });
    }
  }

  submit(): void {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
      delete userData.confirmPass;

      this.dataEntered.emit(userData);
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
