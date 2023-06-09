<script lang="ts">
    import Swal from 'sweetalert2';
    import { db } from '../firebaseConfig';
    import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
    import { toast, modal } from '../utils/swal';

    export let textbook: TextbookDocumentFull;

    const textbookDoc = doc(db, 'sellers', textbook.parentId, 'textbooks', textbook.id);
    let expiryLocaleDateString: string | null = null;
    $: expiryLocaleDateString = textbook.reservation.expiry?.toDate().toLocaleDateString('pl', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) ?? null;

    async function updateStatus() {
        if (textbook.reservation.status) {
            const result = await modal.fire({
                icon: 'warning',
                title: 'Czy jesteś pewien?',
                html: `Podręcznik "<code>${textbook.title}</code>" jest zarezerwowany do:<br><code>${expiryLocaleDateString}</code> przez <strong>${textbook.reservation.holder}</strong>.<br><br><hr><br><i>Czy chcesz usunąć rezerwację i oznaczyć podręcznik jako sprzedany?</i>`,
                confirmButtonText: 'Tak, usuń rezerwację',
                focusCancel: true,
            });
            if (!result.isConfirmed) return;
        }

        await updateDoc(textbookDoc, { sold: true, soldAt: serverTimestamp(), 'reservation.status': false });
        toast.fire({ icon: 'success', title: `Oznaczono podręcznik <strong>${textbook.title}</strong> jako sprzedany!`, timer: 2000 });
    }

    async function createReservation() {
        const form = await modal.fire({
            title: `Zarezerwuj <strong>${textbook.title}</strong>\n(do końca dnia)`,
            html: `<form><input class="swal2-input" placeholder="Rezerwacja dla" name="holder" data-form-type="other"><input type="date" class="swal2-input" placeholder="Rezerwacja do" name="expiry" data-form-type="other"></form>`,
            confirmButtonText: 'Zarezerwuj',
            didOpen: () => (<HTMLInputElement>Swal.getPopup().querySelector('form')[0]).focus(),
            preConfirm: async () => {
                const form = Swal.getPopup().querySelector('form');
                const holder = (<HTMLInputElement>form.holder).value;
                const expiry = (<HTMLInputElement>form.expiry).value;

                if (!holder || !expiry) return Swal.showValidationMessage(`Wypełnij wszystkie pola`);

                const expiryDate = new Date(expiry);
                expiryDate.setHours(23, 59, 59);
                if (expiryDate.getTime() <= Date.now()) return Swal.showValidationMessage(`Wybierz datę w przyszłości.`);

                return { holder, expiry: expiryDate };
            },
        });

        if (!form.isConfirmed) return;

        const { holder, expiry } = <{ holder: string; expiry: Date }>form.value;

        await updateDoc(textbookDoc, { reservation: { status: true, holder, expiry } });
        toast.fire({ icon: 'success', title: `Zarezerwowano <strong>${textbook.title}</strong> do <code>${expiryLocaleDateString}</code> dla <strong>${textbook.reservation.holder}</strong>` });
    }
</script>

<span class:sold={textbook.sold} class:reserved={textbook.reservation.status && !textbook.sold}>
    {textbook.title} - {textbook.price}zł
    {#if !textbook.sold}
        <button on:click={updateStatus}>Sprzedane</button>
        {#if textbook.reservation.status}
            <span class="info"><strong>{textbook.reservation.holder}</strong> do <code>{new Date(textbook.reservation.expiry.toMillis()).toLocaleDateString()}</code></span>
        {:else}
            <button on:click={createReservation}>Rezerwacja</button>
        {/if}
    {:else if textbook.soldAt}
        <span class="info">Sprzedane <code>{new Date(textbook.soldAt.toMillis()).toLocaleDateString()}</code></span>
    {/if}
</span>

<style>
    .sold {
        text-decoration: line-through;
        color: var(--font-light-opaque);
    }
    .reserved {
        color: #f2bf26;
    }
    .reserved::before {
        content: '🔒';
        margin-right: 0.25rem;
    }
    .info {
        margin-left: 1rem;
        opacity: 0.8;
        display: inline-block;
    }

    button {
        font-weight: 700;
        background-color: transparent;
        border: none;
        position: relative;
        z-index: 0;
        margin-left: 1rem;
    }

    button::before {
        content: '';
        position: absolute;
        width: 110%;
        height: 8px;
        bottom: 1px;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
        background-color: var(--accent-primary);
        transition: background-color 100ms;
    }

    button:hover::before {
        background-color: var(--accent-secondary);
    }
</style>
