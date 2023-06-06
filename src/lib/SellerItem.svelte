<script lang="ts">
    import { query, collection, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
    import { db } from '../firebaseConfig';
    import { onMount } from 'svelte';
    import { converter } from '../utils/converter';
    import Swal from 'sweetalert2';
    import toast from '../utils/toast';
    import { user } from '../stores';
    import TextbookItem from './TextbookItem.svelte';

    export let seller: SellerDocumentFull;

    let textbooks: TextbookDocumentFull[] = [];

    onMount(() => {
        // console.log(`created textbook collection listener on ${seller.firstName}`);

        const q = query(collection(db, 'sellers', seller.id, 'textbooks'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<TextbookDocument>()), (snapshot) => {
            // console.log(`textbook snapshot triggered on ${seller.firstName}`);

            let textbookDocuments: TextbookDocumentFull[] = [];
            for (const doc of snapshot.docs) {
                textbookDocuments.push({ ...doc.data(), id: doc.id });
            }
            textbooks = textbookDocuments;
        });

        return () => {
            unsubscribe();
            // console.log(`unsubscribed from textbook collection on ${seller.firstName}`);
        };
    });

    async function addTextbook() {
        const form = await Swal.fire({
            title: `Dodaj podręcznik\n<code>${seller.firstName} ${seller.lastName} ${seller.classSymbol}</code>`,
            html: `<form><input class="swal2-input" placeholder="Nazwa" name="textbookTitle" data-form-type="other"><input type="number" class="swal2-input" placeholder="Cena" name="price" data-form-type="other"></form>`,
            confirmButtonText: 'Dodaj',
            showCancelButton: true,
            cancelButtonText: 'Anuluj',
            focusConfirm: false,
            reverseButtons: true,
            // cancelButtonColor: '#d33d33',
            // confirmButtonColor: '#3523A9',
            backdrop: 'transparent',
            didOpen: () => (<HTMLInputElement>Swal.getPopup().querySelector('form')[0]).focus(),
            preConfirm: async () => {
                const form = Swal.getPopup().querySelector('form');
                const title = (<HTMLInputElement>form.textbookTitle).value;
                const price = parseFloat((<HTMLInputElement>form.price).value);
                const condition: BookCondition = 1;

                if (!title || !price || !condition) return Swal.showValidationMessage(`Wypełnij wszystkie pola`);

                return { title, price, condition };
            },
        });
        if (!form.isConfirmed) return;

        const { title, price, condition } = <TextbookDataForm>form.value;
        const textbookDocument: TextbookDocument = {
            title,
            price,
            condition,
            sold: false,
            email: seller.email,
            sellerEmailName: `${seller.firstName}`,
            reservation: {
                status: false,
                holder: null,
                expiry: null,
            },
            creator: {
                uid: $user.uid,
                email: $user.email,
            },
            parentId: seller.id,
            createdAt: serverTimestamp(),
        };
        addDoc(collection(db, 'sellers', seller.id, 'textbooks'), textbookDocument);

        toast.fire({
            icon: 'success',
            title: `Dodabno podręcznik`,
            text: `${title} - ${price}zł`,
            timer: 4000,
        });
    }
</script>

<details>
    <summary>{seller.firstName} {seller.lastName} {seller.classSymbol} <button on:click={addTextbook}>Dodaj</button></summary>
    {#if textbooks.length > 0}
        {#each textbooks as textbook}
            <TextbookItem {textbook} />
        {/each}
    {:else}
        <span>Brak podręczników</span>
    {/if}
</details>
