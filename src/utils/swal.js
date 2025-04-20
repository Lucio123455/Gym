// utils/swal.js
import Swal from 'sweetalert2';

export const confirmarEliminacion = async (titulo = '¿Estás seguro?', texto = '') => {
  const { isConfirmed } = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e63946',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  return isConfirmed;
};

export const mostrarExito = async (mensaje = 'Operación exitosa') => {
  await Swal.fire({
    title: mensaje,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
};

export const mostrarError = (mensaje = 'Ocurrió un error') => {
  Swal.fire('Error', mensaje, 'error');
};
