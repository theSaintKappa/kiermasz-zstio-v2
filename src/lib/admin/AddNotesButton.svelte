<script lang="ts">
    import { doc, updateDoc } from "firebase/firestore";
    import { db } from "../../firebaseConfig";
    import { fireErrorModal, modal, toast } from "../../utils/swal";

    export let seller: SellerDocumentFull;
    export let notes: SellerDocumentFull["notes"];

    async function addNotes() {
        const { isConfirmed, value } = await modal.fire({
            title: "🗒️ Dodaj notatkę",
            html: `<code>${seller.firstName} ${seller.lastName} ${seller.classSymbol}</code>`,
            input: "textarea",
            inputPlaceholder: "Treść notatki",
            inputValue: notes ?? "",
            inputAttributes: {
                maxlength: "150",
            },
            confirmButtonText: "Zapisz",
            icon: "info",
        });

        if (!isConfirmed) return;

        if (typeof value !== "string") return fireErrorModal(null, "Wystąpił błąd podczas dodawania notatki.");

        try {
            await updateDoc(doc(db, `sellers/${seller.id}`), { notes: value === "" ? null : value });
            toast.fire({
                icon: "success",
                title: value === "" ? "Usunięto notakę" : "Zapisano notatkę",
                text: `${value.length > 24 ? `${value.substring(0, 24)}...` : value}`,
            });
        } catch (err) {
            return fireErrorModal(err, "Wystąpił błąd podczas dodawania notatki.");
        }
    }
</script>

<button on:click={addNotes} class="btn-inline">🗒️ {notes ? "Edytuj" : "Dodaj"} notkę</button>
