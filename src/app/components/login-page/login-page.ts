import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html'
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/inventory']);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Extraer datos del formulario
    const loginData = this.loginForm.value;

    console.log('Intentando iniciar sesión con:', loginData);

    this.authService.login(loginData).subscribe({
      next: (result) => {
        if (result) {
          // Success
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#198754'
          }).then(() => {
            this.router.navigate(['/inventory']);
          });
        } else {
          // Error message
          Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#dc3545'
          });
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        // Error message
        Swal.fire({
          title: 'Error',
          text: 'Error al conectar con el servidor',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
}
