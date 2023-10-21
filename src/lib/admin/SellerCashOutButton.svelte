<script lang="ts">
    import { doc, updateDoc } from 'firebase/firestore';
    import { db } from '../../firebaseConfig';
    import { fireErrorModal, modal, toast } from '../../utils/swal';

    export let seller: SellerDocumentFull;
    export let soldTextbooksSum: number;

    async function setCashedOut() {
        const { isConfirmed } = await modal.fire({
            title: `💸 Zaznacz wypłatę`,
            html: `<code>${seller.firstName} ${seller.lastName}</code> - <strong>${soldTextbooksSum}zł</strong>`,
            confirmButtonText: '💰 Tak',
            icon: 'question',
        });

        if (!isConfirmed) return;

        try {
            await updateDoc(doc(db, `sellers/${seller.id}`), { hasCashedOut: true });
            toast.fire({
                icon: 'success',
                title: `Odznaczono wypłatę`,
                text: `${seller.firstName} ${seller.lastName} - ${soldTextbooksSum}zł`,
            });
        } catch (err) {
            return fireErrorModal(err, 'Wystąpił błąd podczas zaznaczania wypłaty.');
        }
    }
</script>

<button on:click={setCashedOut} class="btn-inline">💸 Wypłata</button>
