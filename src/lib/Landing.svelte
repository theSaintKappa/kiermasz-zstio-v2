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

{#each textbooks as textbook}
    <span>{textbook.title} {textbook.price}zł</span>
{/each}
