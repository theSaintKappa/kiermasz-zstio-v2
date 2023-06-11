<script lang="ts">
    import SellersPanel from './SellersPanel.svelte';
    import TextbooksPanel from './TextbooksPanel.svelte';
</script>

<main>
    <SellersPanel />
    <TextbooksPanel />
</main>

<style>
    :root {
        --panel-margin: 1.75rem;
    }
    main {
        width: calc(100% - (2 * var(--panel-margin)));
        margin: var(--panel-margin) 0;
        display: grid;
        gap: calc(2 * var(--panel-margin));
        grid-template-columns: 60% 1fr;
    }
    @media screen and (max-width: 500px) {
        main {
            grid-template-columns: 1fr;
        }
    }
</style>
