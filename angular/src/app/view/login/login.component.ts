import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm para el control del formulario
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { ApiService2 } from '../../../services/proyect2/api.service'; // Asegúrate de que esta ruta sea correcta

// Interfaz para la respuesta de login/registro (ajusta según tu API)
interface AuthResponse {
  status: boolean;
  data?: {
    userId?: number;
    user_name?: string;
    email: string;
  };
  tipo ?: string; // register o login
  message?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule es CRUCIAL para [(ngModel)]
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  // Objeto para los datos del formulario de login/registro
  formData = {
    user_name : '',
    email: '',
    password: '',
    confirmPassword: '', // Solo para registro
  };

  // Modo actual: true para login, false para registro
  isLoginMode: boolean = true;

  constructor(
    private router: Router,
    private apiService: ApiService2 // Inyecta tu ApiService2
  ) { }

  ngOnInit(): void {
    // Aquí puedes añadir lógica de inicialización si es necesaria,
    // como verificar si ya hay un usuario logeado.
  }

  ngOnDestroy(): void {
    // Lógica de limpieza
  }

  /**
   * Alterna entre el modo de login y registro.
   * Limpia el formulario al cambiar de modo.
   */
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    // Limpiar el formulario al cambiar de modo
    this.formData = {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  /**
   * Maneja el envío del formulario.
   * Llama al método de login o registro de la API según el modo actual.
   * @param form El formulario NgForm para validar su estado.
   */
  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      Swal.fire({
        title: 'Formulario Inválido',
        text: 'Por favor, completa todos los campos requeridos correctamente.',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Validar que las contraseñas coincidan en modo registro
    if (!this.isLoginMode && this.formData.password !== this.formData.confirmPassword) {
      Swal.fire({
        title: 'Error de Contraseña',
        text: 'Las contraseñas no coinciden. Por favor, verifica.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    try {
      let response: AuthResponse;

      if (this.isLoginMode) {
          const loginResult = await this.apiService.login({
            email: this.formData.email,
            password: this.formData.password
          });
          response = (loginResult && typeof loginResult === 'object' && 'status' in loginResult)
            ? loginResult as AuthResponse
            : { status: false, message: 'Respuesta inválida del servidor.' };
      } else {
          const registerResult = await this.apiService.createUser({
            user_name: this.formData.user_name,
            email: this.formData.email,
            password: this.formData.password,
          });
          
          if(registerResult) {
            response = {
              status: true,
              message: 'Usuario registrado exitosamente.',
              tipo: 'register'
            };
          } else {
            response = {
              status: false,
              message: 'No se pudo registrar el usuario. Inténtelo de nuevo.',
              tipo: 'register'
            };
          }
      }

      if (response.status) {
        Swal.fire({
          title: this.isLoginMode ? '¡Inicio de sesión exitoso!' : '¡Registro exitoso!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false
        });

        // Redirige a al login
        if(response.tipo === 'register') {
          this.isLoginMode = true; // Cambia a modo login después de registro exitoso
          return
        }

        // Funciones para el login exitoso

        // Determina el rol y guarda en localStorage
        localStorage.setItem('user', JSON.stringify({ ...response.data }));

        // Dispara evento global (si otros módulos lo escuchan)
        window.dispatchEvent(new Event('userLoggedIn'));

        this.router.navigate(['/']);

      } else {
        // Mensaje de error de la API o genérico
        Swal.fire({
          title: 'Error',
          text: response.message || (this.isLoginMode ? 'Correo o contraseña incorrectos.' : 'No se pudo registrar el usuario. Inténtelo de nuevo.'),
          icon: 'error',
          timer: 1800,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      }
    } catch (error: any) {
      console.error('Error durante la operación:', error);
      Swal.fire({
        title: 'Error de Conexión',
        text: `No se pudo ${this.isLoginMode ? 'iniciar sesión' : 'registrar'}: ${error.message || 'Error desconocido del servidor.'}`,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false
      });
    }
  }

  /**
   * Helper para verificar si las contraseñas coinciden.
   * Utilizado en la plantilla para mostrar mensajes de validación.
   */
  passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword;
  }
}
