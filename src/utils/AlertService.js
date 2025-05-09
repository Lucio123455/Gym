import Swal from 'sweetalert2';

// ✅ Alertas rápidas estilo toast
export const showToastSuccess = (message = 'Operation successful') => {
  Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    position: 'top-end',
  });
};

export const showToastError = (message = 'An error occurred') => {
  Swal.fire({
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end',
  });
};

// ✅ Confirmaciones genéricas
export const showConfirmationDialog = async (message = 'Are you sure you want to continue?') => {
  const result = await Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, continue',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
};

// ✅ Confirmación específica para eliminar
export const confirmDeletionDialog = async (
  title = 'Are you sure?',
  text = 'This action cannot be undone.'
) => {
  const { isConfirmed } = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e63946',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel'
  });
  return isConfirmed;
};

// ✅ Alertas modales (centrales, no toast)
export const showModalSuccess = async (message = 'Operation successful') => {
  await Swal.fire({
    title: message,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
};

export const showModalError = (message = 'An error occurred') => {
  Swal.fire('Error', message, 'error');
};

  