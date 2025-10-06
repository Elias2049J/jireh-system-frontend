import Swal from 'sweetalert2';

export function showSuccessAlert(message: string) {
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
    timer: 1800,
    showConfirmButton: false
  });
}

export function showErrorAlert(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    timer: 2200,
    showConfirmButton: false
  });
}

