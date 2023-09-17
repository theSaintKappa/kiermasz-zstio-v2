<script lang="ts">
    import { collectionGroup, onSnapshot, orderBy, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { blur } from 'svelte/transition';
    import { db } from '../../firebaseConfig';
    import { searchQuery } from '../../stores';
    import { converter } from '../../utils/converter';

    let textbooks: TextbookDocumentFull[] = [];
    let filteredTextbooks: TextbookDocumentFull[] = [];

    onMount(() => {
        const q = query(collectionGroup(db, 'textbooks'), where('sold', '==', false), where('reservation.status', '==', false), orderBy('title', 'asc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<TextbookDocument>()), (snapshot) => {
            let textbookDocuments: TextbookDocumentFull[] = [];
            for (const doc of snapshot.docs) {
                textbookDocuments.push({ ...doc.data(), id: doc.id });
            }
            filteredTextbooks = textbooks = textbookDocuments;
        });

        return () => unsubscribe();
    });

    searchQuery.subscribe((query) => {
        if (query === '') return (filteredTextbooks = textbooks);
        filteredTextbooks = textbooks.filter((textbook) => textbook.title.toLowerCase().includes(query.toLowerCase()));
    });
</script>

<section>
    {#each filteredTextbooks as textbook, i}
        <div class="card" in:blur={{ delay: i * 7.5, duration: 750 }}>
            <span class="title">{textbook.title}</span>
            <div class="info">
                <span class="price">{textbook.price}zł</span>
                <img src="/condition{textbook.condition}.svg" alt="" />
            </div>
        </div>
    {/each}
</section>
{#if !filteredTextbooks.length && !textbooks.length}
    <h2>Wczytywanie podręczników...</h2>
{/if}
{#if !filteredTextbooks.length && textbooks.length}
    <h2>Brak podręczników pasujących do frazy "{$searchQuery.length > 16 ? $searchQuery.slice(0, 16) + '...' : $searchQuery}"</h2>
{/if}

<style>
    :root {
        --gap: 1rem;
    }

    section {
        display: grid;
        place-items: center;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        width: min(100% - 2 * var(--gap), 1800px);
        gap: var(--gap);
    }

    @media screen and (max-width: 700px) {
        section {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
    }

    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        height: 6.875em;
        background-color: var(--bg-secondary);
        padding-inline: 1.2rem;
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
        background-color: var(--accent-secondary);
    }

    .title {
        font-weight: 500;
        text-align: center;
        text-shadow: 0.125em 0.125em 2px rgba(0, 0, 0, 0.75);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-wrap: balance;
    }

    .info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .price {
        font-weight: 900;
        letter-spacing: 1px;
        padding: 0.1rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 1.2rem;
        text-shadow: 0.125em 0.125em 1.5px rgba(0, 0, 0, 0.5);
        background-color: var(--price-color);
    }

    img {
        height: 90%;
        border-radius: 50%;
        box-shadow: 0 0 2px var(--font-light-opaque);
    }
</style>
