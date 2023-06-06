<script lang="ts">
    import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
    import { db } from '../firebaseConfig';
    import { user } from '../stores';
    import Swal from 'sweetalert2';
    import toast from '../utils/toast';

    async function addSeller() {
        const form = await Swal.fire({
            title: `Dodaj nowego sprzedawcę`,
            html: `<form><input class="swal2-input" placeholder="Imię" name="firstName" data-form-type="other"><input class="swal2-input" placeholder="Nazwisko" name="lastName" data-form-type="other"><input class="swal2-input" placeholder="Klasa" name="classSymbol" data-form-type="other"><input class="swal2-input" placeholder="Email" name="email" data-form-type="other"></form>`,
            confirmButtonText: 'Dodaj',
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
                const firstName = (<HTMLInputElement>form.firstName).value;
                const lastName = (<HTMLInputElement>form.lastName).value;
                const classSymbol = (<HTMLInputElement>form.classSymbol).value;
                const email = (<HTMLInputElement>form.email).value || null;

                if (!firstName || !lastName || !classSymbol) return Swal.showValidationMessage(`Wypełnij wszystkie pola`);

                return { firstName, lastName, classSymbol, email };
            },
        });
        if (!form.isConfirmed) return;

        const { firstName, lastName, classSymbol, email } = <SellerDataForm>form.value;
        const sellerDocument: SellerDocument = {
            firstName,
            lastName,
            classSymbol,
            email,
            creator: {
                uid: $user.uid,
                email: $user.email,
            },
            createdAt: serverTimestamp(),
        };
        addDoc(collection(db, 'sellers'), sellerDocument);

        toast.fire({
            icon: 'success',
            title: `Dodabno sprzedawcę`,
            text: `${firstName} ${lastName} ${classSymbol}`,
            timer: 4000,
        });
    }
</script>

<button on:click={addSeller}>Dodaj Sprzedawcę</button>
