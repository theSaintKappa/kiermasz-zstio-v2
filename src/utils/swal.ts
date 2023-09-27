import Swal from 'sweetalert2';

export const toast = Swal.mixin({
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

export const modal = Swal.mixin({
    focusConfirm: false,
    confirmButtonColor: '#3b27be',
    background: '#191722',
    backdrop: 'transparent',
    showCancelButton: true,
    cancelButtonText: 'Anuluj',
    reverseButtons: true,
    allowEnterKey: false,
    scrollbarPadding: false,
    didOpen: () => {
        const form = Swal.getPopup().querySelector('form');
        form && form[0] instanceof HTMLInputElement && form[0].focus();
    },
});

export const fireErrorModal = (err: Error, title?: string) => {
    console.error(err);
    modal.fire({ icon: 'error', title: title ?? 'Wystąpił błąd.', html: `Skontaktuj się z administratorem lub spróbuj ponownie później.<br><br><i><code>${err.name}: ${err.message}</code></i>`, showCancelButton: false });
};

window.onkeyup = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && Swal.getPopup()) Swal.clickConfirm();
};
