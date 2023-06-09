<script lang="ts">
    import { db } from '../firebaseConfig';
    import { query, collection, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
    import { converter } from '../utils/converter';
    import { onMount } from 'svelte';
    import { lastBackup } from '../stores';

    onMount(() => {
        const q = query(collection(db, 'backups'), orderBy('createdAt', 'desc'), where('status', '==', 'complete'), limit(1));
        const unsubscribe = onSnapshot(q.withConverter(converter<BackupDocument>()), (snapshot) => {
            if (!snapshot.empty) $lastBackup = snapshot.docs[0].data();
        });

        return () => unsubscribe();
    });
</script>

{#if $lastBackup}
    <span>Ostatnia kopia zapasowa: {$lastBackup.createdAt.toDate().toLocaleString()} ({$lastBackup.type ?? 'unknown'})</span>
{/if}
