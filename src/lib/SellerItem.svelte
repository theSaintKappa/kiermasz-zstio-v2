<script lang="ts">
    import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import Swal from 'sweetalert2';
    import { db } from '../firebaseConfig';
    import { textbookTitles, user } from '../stores';
    import { converter } from '../utils/converter';
    import { modal, toast } from '../utils/swal';
    import TextbookItem from './TextbookItem.svelte';
    import face1 from '/condition1.svg';
    import face2 from '/condition2.svg';
    import face3 from '/condition3.svg';
    import face4 from '/condition4.svg';

    export let seller: SellerDocumentFull;

    let textbooks: TextbookDocumentFull[] = [];

    onMount(() => {
        const q = query(collection(db, 'sellers', seller.id, 'textbooks'), orderBy('sold'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<TextbookDocument>()), (snapshot) => {
            let textbookDocuments: TextbookDocumentFull[] = [];
            for (const doc of snapshot.docs) {
                textbookDocuments.push({ ...doc.data(), id: doc.id });
            }
            textbooks = textbookDocuments;
        });

        return () => unsubscribe();
    });

    let detailsElement: HTMLDetailsElement;

    let titleOptions: string;
    $: titleOptions = $textbookTitles.map((title) => `<option value="${title}">`).join('');

    async function addTextbook() {
        const result = await modal.fire({
            title: `Dodaj podręcznik\n<code>${seller.firstName} ${seller.lastName} ${seller.classSymbol}</code>`,
            html: `<form><input list="titles" class="swal2-input" placeholder="Nazwa" name="textbookTitle" data-form-type="other"><datalist id="titles">${titleOptions}</datalist><input type="number" class="swal2-input" placeholder="Cena" name="price" data-form-type="other"><fieldset class="condition-wrapper"><legend>Stan fizyczny</legend><label><input type="radio" name="condition" value="1" /><img src=${face1} alt="1" /></label><label><input type="radio" name="condition" value="2" /><img src=${face2} alt="2" /></label><label><input type="radio" name="condition" value="3" checked /><img src=${face3} alt="3" /></label><label><input type="radio" name="condition" value="4" /><img src=${face4} alt="4" /></label></fieldset></form>`,
            confirmButtonText: 'Dodaj',
            didOpen: () => {
                (<HTMLInputElement>Swal.getPopup().querySelector('form')[0]).focus();
                const radios = Swal.getPopup().querySelectorAll('input[type="radio"]');
                const fieldset = Swal.getPopup().querySelector('fieldset');
                const colors = ['#ff3313', '#ffcd19', '#82ff28', '#ac00b8'];
                fieldset.style.borderColor = colors[parseInt((<HTMLInputElement>Swal.getPopup().querySelector('input[type="radio"]:checked')).value) - 1];
                radios.forEach((radio: HTMLInputElement) => (radio.onchange = (e) => (fieldset.style.borderColor = colors[parseInt((<HTMLInputElement>e.target).value) - 1])));
            },
            preConfirm: async () => {
                const form = Swal.getPopup().querySelector('form');
                const title = (<HTMLInputElement>form.textbookTitle).value;
                const price = parseFloat((<HTMLInputElement>form.price).value);
                const condition = <TextbookCondition>parseInt((<HTMLInputElement>form.condition).value);

                if (!title || !price || !condition) return Swal.showValidationMessage(`Wypełnij wszystkie pola`);

                return { title, price, condition };
            },
        });
        if (!result.isConfirmed) return;

        const { title, price, condition } = <TextbookDataForm>result.value;
        const textbookDocument: TextbookDocument = {
            title,
            price,
            condition,
            sold: false,
            soldAt: null,
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

        detailsElement?.setAttribute('open', '');
    }
</script>

<details bind:this={detailsElement}>
    <summary><span>{seller.firstName} {seller.lastName}{seller.classSymbol ? ` | ${seller.classSymbol}` : ''}</span><button on:click={addTextbook}>+ Dodaj</button></summary>
    {#if textbooks.length > 0}
        <div>
            {#each textbooks as textbook}
                {#key textbook.id}
                    <TextbookItem {textbook} />
                {/key}
            {/each}
        </div>
    {:else}
        <div>
            <span>Brak podręczników</span>
        </div>
    {/if}
</details>

<style>
    details {
        background-color: var(--bg-secondary);
    }

    details:nth-child(2n) {
        background-color: var(--bg-primary);
    }

    summary {
        padding: 0.5rem 0 0.5rem 1.25rem;
    }
    summary > span {
        font-weight: 500;
        cursor: pointer;
    }

    details[open] summary > span {
        font-weight: 900;
        letter-spacing: 1px;
    }
    details:not([open]) summary::marker {
        color: var(--font-light-opaque);
    }

    button {
        font-weight: 600;
        background-color: transparent;
        border: none;
        position: relative;
        z-index: 0;
        margin-left: 1.25rem;
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

    div {
        position: relative;
        margin: 0.25rem 0 1rem 2.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
