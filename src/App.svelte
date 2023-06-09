<script lang="ts">
    import { user } from './stores';
    import Header from './lib/Header.svelte';
    import AdminPanel from './lib/AdminDasboard.svelte';
    import Landing from './lib/Landing.svelte';
</script>

<Header />
{#if !$user}
    <Landing />
{:else}
    <AdminPanel />
{/if}
