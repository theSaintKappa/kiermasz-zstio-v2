import Swal from 'sweetalert2';

const toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#191722',
    showClass: { popup: 'toast-slidein' },
    hideClass: { popup: 'toast-slideout' },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});
export default toast;
