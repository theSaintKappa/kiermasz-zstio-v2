<script lang="ts">
    import { db } from '../firebaseConfig';
    import { query, collection, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
    import { converter } from '../utils/converter';
    import { onMount } from 'svelte';

    let backup: Backup = null;

    onMount(() => {
        const q = query(collection(db, 'backups'), orderBy('createdAt', 'desc'), where('status', '==', 'complete'), limit(1));
        const unsubscribe = onSnapshot(q.withConverter(converter<Backup>()), (snapshot) => {
            if (!snapshot.empty) backup = snapshot.docs[0].data();
        });

        return () => unsubscribe();
    });
</script>

{#if backup}
    <span>Ostatnia kopia zapasowa: {backup.createdAt.toDate().toLocaleString()} ({backup.type ?? 'unknown'})</span>
{/if}
