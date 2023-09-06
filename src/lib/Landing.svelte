<script lang="ts">
    import { collectionGroup, onSnapshot, orderBy, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { db } from '../firebaseConfig';
    import { converter } from '../utils/converter';

    let textbooks: TextbookDocumentFull[] = [];

    onMount(() => {
        const q = query(collectionGroup(db, 'textbooks'), where('sold', '==', false), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<TextbookDocument>()), (snapshot) => {
            let textbookDocuments: TextbookDocumentFull[] = [];
            for (const doc of snapshot.docs) {
                textbookDocuments.push({ ...doc.data(), id: doc.id });
            }
            textbooks = textbookDocuments;
        });

        return () => unsubscribe();
    });
</script>

<section>
    {#each textbooks as textbook}
        <div class="card">
            <span class="title">{textbook.title}</span>
            <div class="info"><span class="price">{textbook.price}zł</span><span class="condition">{textbook.condition}</span></div>
        </div>
    {/each}
</section>

<style>
    :root {
        --gap: 1rem;
    }

    section {
        /* display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        width: min(100% - 2 * 1rem, 1200px);
        gap: 1rem; */
        display: grid;
        /* justify-content: center;
        align-items: center; */
        place-items: center;
        margin: var(--gap) 0 5rem;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        width: min(100% - 2 * var(--gap), 1200px);
        gap: var(--gap);
        transition: gap 250ms;
    }

    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
        background-color: var(--bg-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
        position: relative;
        overflow: hidden;
    }
    .card::before {
        content: '';
        position: absolute;
        left: 0;
        height: 100%;
        width: 2.5%;
        background-color: #ff009d;
    }

    .title {
        font-weight: 500;
        text-wrap: balance;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    }

    .info {
        display: flex;
        gap: 1.5rem;
        margin: 0.25rem 0;
    }

    .price,
    .condition {
        font-weight: 800;
        padding: 0.15rem 0.3rem;
        border-radius: 0.25rem;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    }
    .price {
        background-color: rgb(46, 164, 46);
    }
    .condition {
        background-color: purple;
    }
</style>
