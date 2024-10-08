<script lang="ts">
    import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
    import Swal from "sweetalert2";
    import { db, sendEmail } from "../../firebaseConfig";
    import { writingDisabled } from "../../stores";
    import { fireErrorModal, modal, toast } from "../../utils/swal";

    export let textbook: TextbookDocumentFull;

    const textbookDoc = doc(db, "sellers", textbook.parentId, "textbooks", textbook.id);
    let expiryLocaleDateString: string | null = null;
    $: expiryLocaleDateString = textbook.reservation.expiry?.toDate().toLocaleDateString("pl", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) ?? null;

    let soldButton: HTMLButtonElement | null = null;

    async function updateStatus() {
        if (soldButton?.disabled) return;

        if (textbook.reservation.status) {
            const result = await modal.fire({
                icon: "warning",
                title: "Czy jesteś pewien?",
                html: `Podręcznik "<code>${textbook.title}</code>" jest zarezerwowany do:<br><code>${expiryLocaleDateString}</code> przez <strong>${textbook.reservation.holder}</strong>.<br><br><hr><br><i>Czy chcesz usunąć rezerwację i oznaczyć podręcznik jako sprzedany?</i>`,
                confirmButtonText: "Tak, usuń rezerwację",
                focusCancel: true,
            });
            if (!result.isConfirmed) return;
        }

        try {
            await updateDoc(textbookDoc, { sold: true, soldAt: serverTimestamp(), "reservation.status": false });

            new Audio("/sounds/set-sold.mp3").play();

            toast.fire({ icon: "success", title: `Oznaczono podręcznik <strong>${textbook.title}</strong> jako sprzedany!`, timer: 2000 });
        } catch (err) {
            return fireErrorModal(err, "Wystąpił błąd podczas oznaczania podręcznika jako sprzedany.");
        }

        if (textbook.email) {
            sendEmail({
                to: textbook.email,
                subject: "Podręcznik sprzedany!",
                html: `Cześć ${textbook.sellerEmailName},<br><br>Podręcznik "${textbook.title}" wystawiony przez ciebie na sprzedaż właśnie został kupiony za ${textbook.price}PLN.<br><br>Pozdrawiamy,<br>Biblioteka ZSTiO`,
            });
        }
    }

    async function createReservation() {
        const form = await modal.fire({
            title: `Zarezerwuj <strong>${textbook.title}</strong>\n(do końca dnia)`,
            html: `<form><input class="swal2-input" placeholder="Rezerwacja dla" name="holder" data-form-type="other"><input type="date" class="swal2-input" placeholder="Rezerwacja do" name="expiry" data-form-type="other"></form>`,
            confirmButtonText: "Zarezerwuj",
            preConfirm: async () => {
                const form = Swal.getPopup()?.querySelector("form");
                const holder = (<HTMLInputElement>form?.holder).value;
                const expiry = (<HTMLInputElement>form?.expiry).value;

                if (!holder || !expiry) return Swal.showValidationMessage("Wypełnij wszystkie pola.");

                const expiryDate = new Date(expiry);
                expiryDate.setHours(23, 59, 59);
                if (expiryDate.getTime() <= Date.now()) return Swal.showValidationMessage("Wybierz datę w przyszłości.");

                return { holder, expiry: expiryDate };
            },
        });

        if (!form.isConfirmed) return;

        const { holder, expiry } = <{ holder: string; expiry: Date }>form.value;

        try {
            await updateDoc(textbookDoc, { reservation: { status: true, holder, expiry } });

            toast.fire({ icon: "success", title: `Zarezerwowano <strong>${textbook.title}</strong> do <code>${expiryLocaleDateString}</code> dla <strong>${textbook.reservation.holder}</strong>` });
        } catch (err) {
            fireErrorModal(err, "Wystąpił błąd podczas tworzenia rezerwacji.");
        }
    }
</script>

<span class:sold={textbook.sold} class:reserved={textbook.reservation.status && !textbook.sold} class="textbook">
    <span class:crossed-out={textbook.sold}>{textbook.title}</span>
    <div class="price">{textbook.price}zł</div>
    {#if !textbook.sold}
        <div class="buttons">
            <button on:dblclick={updateStatus} bind:this={soldButton} disabled={$writingDisabled || null} aria-label="Oznacz jako sprzedany">Sprzedane</button>
            {#if !textbook.reservation.status}
                <button on:click={createReservation} disabled={$writingDisabled || null} aria-label="Dodaj rezerwację">Rezerwacja</button>
            {/if}
        </div>
        {#if textbook.reservation.status}
            {#if textbook.reservation.expiry}
                <span class="info"><strong>{textbook.reservation.holder}</strong> do <code>{new Date(textbook.reservation.expiry.toMillis()).toLocaleDateString()}</code></span>
            {/if}
        {/if}
    {:else if textbook.soldAt}
        <span class="info">{new Date(textbook.soldAt.toMillis()).toLocaleString()}</span>
    {/if}
</span>

<style>
    .sold {
        font-style: italic;
        color: var(--font-light-opaque);
    }
    .crossed-out {
        text-decoration: line-through;
        opacity: 0.75;
    }
    .reserved {
        color: var(--warning-color);
    }
    .reserved::before {
        content: "🔒";
        margin-right: 0.25rem;
    }
    .info {
        margin-left: 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .textbook {
        display: flex;
        align-items: center;
        position: relative;
    }
    .textbook::after {
        content: "";
        position: absolute;
        width: 2px;
        top: 0;
        height: 100%;
        background-color: white;
    }
    .textbook:last-of-type::after {
        height: 50%;
    }
    .textbook.reserved::after {
        background-color: var(--warning-color);
    }
    .textbook.sold::after {
        background-color: var(--font-light-opaque);
    }
    .textbook::before {
        content: "";
        height: 2px;
        width: 25px;
        margin-right: 0.25rem;
        background-color: white;
    }
    .textbook.reserved::before {
        background-color: var(--warning-color);
    }
    .textbook.sold::before {
        background-color: var(--font-light-opaque);
    }

    .price {
        background-color: var(--price-color);
        font-weight: 800;
        border-radius: 0.25rem;
        padding: 0 0.3rem;
        margin-left: 0.5rem;
    }

    .buttons {
        display: flex;
        gap: 1rem;
        margin-inline: 1rem;
    }

    button {
        font-weight: 600;
        background-color: transparent;
        border: none;
        position: relative;
        z-index: 0;
    }

    button::before {
        content: "";
        position: absolute;
        width: 105%;
        height: 15%;
        bottom: 1px;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;

        background-color: var(--accent-primary);
        transition: 100ms;
    }

    button:hover::before {
        background-color: var(--accent-secondary);
        height: 30%;
    }
</style>
