<script lang="ts">
    import { user } from './stores';
    import Header from './lib/Header.svelte';
    import AdminPanel from './lib/AdminDasboard.svelte';
    // import Landing from './lib/Landing.svelte';
</script>

<Header />
{#if !$user}
    <!-- <Landing /> -->
    <span>Jeszcze tu nic nie ma 🤷</span>
{:else}
    <AdminPanel />
{/if}

<style>
    span {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }
</style>
