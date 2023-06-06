<script lang="ts">
    import { db } from '../firebaseConfig';
    import { query, collectionGroup, where, orderBy, onSnapshot } from 'firebase/firestore';
    import { converter } from '../utils/converter';
    import { onMount } from 'svelte';

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

<div class="grid">
    {#each textbooks as textbook}
        <div>{textbook.title} {textbook.price}zł</div>
        <div>{textbook.title} {textbook.price}zł</div>
        <div>{textbook.title} {textbook.price}zł</div>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        width: min(100% - 2 * 1rem, 1200px);
        gap: 1rem;
    }

    .grid > div {
        display: flex;
        width: 200px;
        height: 100px;
        background-color: var(--bg-secondary);
    }
</style>
