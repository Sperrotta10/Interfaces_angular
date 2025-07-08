import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta correcta
import Swal from 'sweetalert2';

// Este guard verifica si el usuario está autenticado
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // El usuario está autenticado, permite el acceso a la ruta
  } else {
    // El usuario no está autenticado, redirige a la página de login
    router.navigate(['/login']);
    return false;
  }
};

// Este guard verifica si el usuario tiene un rol específico
export const roleGuard = (requiredRole: 'admin' | 'user'): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUserValue; // Obtiene el usuario actual

    if (!user) {
      // Si no hay usuario, redirige a login
      router.navigate(['/login']);
      return false;
    }

    // Si el usuario existe, verifica si tiene el rol requerido
    if (user.role === requiredRole) {
      return true; // El usuario tiene el rol requerido, permite el acceso
    } else {
      // El usuario no tiene el rol requerido, redirige a una página de "acceso denegado"
      // o a la página de inicio, dependiendo de tu UX.
       Swal.fire({
        title: 'Error de Autorización',
        text: 'Acceso Denegado: No tienes permisos para ver esta página',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      });
          
      router.navigate(['/']); // O a una página /access-denied
      return false;
    }
  };
};
