<script lang="ts">
    import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { db } from '../firebaseConfig';
    import { lastBackup } from '../stores';
    import { converter } from '../utils/converter';

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
{:else}
    <span>Brak kopii zapasowych</span>
{/if}

<style>
    span {
        font-weight: 200;
        font-size: 0.75rem;
    }
</style>
