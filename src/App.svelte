<script lang="ts">
    import Footer from './lib/Footer.svelte';
    import Header from './lib/Header.svelte';
    import DasboardPanels from './lib/admin/DasboardPanels.svelte';
    import Landing from './lib/customer/Landing.svelte';
    import { user } from './stores';
</script>

<Header />
<main>
    {#if $user}
        <DasboardPanels />
    {:else}
        <Landing />
    {/if}
</main>
<Footer />

<style>
    main {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>
