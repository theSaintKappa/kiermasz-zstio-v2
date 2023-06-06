<script lang="ts">
    import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
    import { db } from '../firebaseConfig';
    import { onMount } from 'svelte';
    import { converter } from '../utils/converter';
    import SellerItem from './SellerItem.svelte';

    let sellers: SellerDocumentFull[] = [];

    onMount(() => {
        const q = query(collection(db, 'sellers'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<SellerDocument>()), (snapshot) => {
            // console.log('sellers snapshot triggered');

            let sellerDocuments: SellerDocumentFull[] = [];
            for (const doc of snapshot.docs) {
                sellerDocuments.push({ ...doc.data(), id: doc.id });
            }
            sellers = sellerDocuments;
        });

        return () => {
            unsubscribe();
            // console.log('unsubscribed from sellers collection');
        };
    });
</script>

{#each sellers as seller}
    {#key seller.id}
        <SellerItem {seller} />
    {/key}
{/each}
