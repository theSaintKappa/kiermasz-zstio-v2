<script lang="ts">
    import { blur } from "svelte/transition";
    import Footer from "./lib/Footer.svelte";
    import Header from "./lib/Header.svelte";
    import DashboardPanels from "./lib/admin/DashboardPanels.svelte";
    import Landing from "./lib/customer/Landing.svelte";
    import { user, writingDisabled } from "./stores";
</script>

<Header />
<main>
    {#if $user}
        <DashboardPanels />
    {:else}
        <span>Lista sprzedawanych podręczników pojawi się tutaj w środę 13.09</span>
        <!-- <Landing /> -->
    {/if}
</main>
<Footer />
{#if $writingDisabled && $user}
    <div>Wprowadzanie zmian zostało wyłączone</div>
{/if}

<style>
    span {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 2rem 1rem;
        text-align: center;
    }

    main {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    div {
        position: fixed;
        bottom: 0.5rem;
        font-size: clamp(1rem, 4vw, 2.25rem);
        font-weight: 700;
        opacity: 0.45;
        color: var(--warning-color);
        pointer-events: none;
    }
</style>
