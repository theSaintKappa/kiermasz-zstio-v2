<script lang="ts">
    import AdminPanel from './lib/AdminDasboard.svelte';
    import Header from './lib/Header.svelte';
    // import Landing from './lib/Landing.svelte';
    import { user } from './stores';
</script>

<Header />
<main>
    {#if !$user}
        <!-- <Landing /> -->
        <span>Lista dostępnych podręczników pojawi się w środę 13.09</span>
    {:else}
        <AdminPanel />
    {/if}
</main>

<style>
    span {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }

    main {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>
