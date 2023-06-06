<script lang="ts">
    import Swal from 'sweetalert2';
    import { db } from '../firebaseConfig';
    import { doc, updateDoc } from 'firebase/firestore';
    import toast from '../utils/toast';

    export let textbook: TextbookDocumentFull;

    const textbookDoc = doc(db, 'sellers', textbook.parentId, 'textbooks', textbook.id);
    let expiryLocaleDateString: string | null = null;
    $: expiryLocaleDateString = textbook.reservation.expiry?.toDate().toLocaleDateString('pl', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) ?? null;

    async function updateStatus() {
        if (textbook.reservation.status) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Czy jesteś pewien?',
                html: `Podręcznik "<code>${textbook.title}</code>" jest zarezerwowany do:<br><code>${expiryLocaleDateString}</code> przez <strong>${textbook.reservation.holder}</strong>.<br><br><hr><br><i>Czy chcesz usunąć rezerwację i oznaczyć podręcznik jako sprzedany?</i>`,
                confirmButtonText: 'Tak, usuń rezerwację',
                showCancelButton: true,
                cancelButtonText: 'Nie, anuluj',
                focusCancel: true,
                reverseButtons: true,
                confirmButtonColor: '#3b27be',
                background: '#191722',
                backdrop: 'transparent',
            });
            if (!result.isConfirmed) return;
        }

        await updateDoc(textbookDoc, { sold: true, 'reservation.status': false });
        toast.fire({ icon: 'success', title: `Oznaczono podręcznik <strong>${textbook.title}</strong> jako sprzedany!` });
    }

    async function createReservation() {
        const form = await Swal.fire({
            title: `Zarezerwuj <strong>${textbook.title}</strong>\n(do końca dnia)`,
            html: `<form><input class="swal2-input" placeholder="Rezerwacja dla" name="holder" data-form-type="other"><input type="date" class="swal2-input" placeholder="Rezerwacja do" name="expiry" data-form-type="other"></form>`,
            confirmButtonText: 'Zarezerwuj',
            showCancelButton: true,
            cancelButtonText: 'Anuluj',
            focusConfirm: false,
            reverseButtons: true,
            confirmButtonColor: '#3b27be',
            background: '#191722',
            backdrop: 'transparent',
            didOpen: () => (<HTMLInputElement>Swal.getPopup().querySelector('form')[0]).focus(),
            preConfirm: async () => {
                const form = Swal.getPopup().querySelector('form');
                const holder = (<HTMLInputElement>form.holder).value;
                const expiry = new Date((<HTMLInputElement>form.expiry).value);
                expiry.setHours(23, 59, 59);

                if (!holder || !expiry) return Swal.showValidationMessage(`Wypełnij wszystkie pola`);
                if (expiry.getTime() <= Date.now()) return Swal.showValidationMessage(`Wybierz datę w przyszłości.`);

                return { holder, expiry };
            },
        });
        if (!form.isConfirmed) return;

        const { holder, expiry } = <{ holder: string; expiry: Date }>form.value;

        await updateDoc(textbookDoc, { reservation: { status: true, holder, expiry } });

        toast.fire({ icon: 'success', title: `Zarezerwowano <strong>${textbook.title}</strong> do <code>${expiryLocaleDateString}</code> dla <strong>${textbook.reservation.holder}</strong>` });
    }
</script>

<span>
    {textbook.title} - {textbook.price}zł
    {#if !textbook.sold}
        <button on:click={updateStatus}>Sprzedane</button>
        {#if !textbook.reservation.status}
            <button on:click={createReservation}>Rezerwacja</button>
        {/if}
    {/if}
</span>
