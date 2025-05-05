// components/AlertService.js
import Swal from 'sweetalert2';

export const showSuccess = (message = 'Operación exitosa') => {
  Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    position: 'top-end',
  });
};

export const showError = (message = 'Ocurrió un error') => {
  Swal.fire({
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end',
  });
};

export const showConfirm = async (message = '¿Estás seguro que querés continuar?') => {
    const result = await Swal.fire({
      title: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
    });
  
    return result.isConfirmed;
  };
  