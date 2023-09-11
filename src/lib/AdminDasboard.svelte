<script lang="ts">
    import SellersPanel from './SellersPanel.svelte';
    import TextbooksPanel from './TextbooksPanel.svelte';
</script>

<div>
    <SellersPanel />
    <TextbooksPanel />
</div>

<style>
    :root {
        --panel-margin: 1.75rem;
    }
    div {
        width: calc(100% - (2 * var(--panel-margin)));
        margin: var(--panel-margin) 0;
        display: grid;
        gap: var(--panel-margin);
        grid-template-columns: 60% 1fr;
    }
    @media screen and (max-width: 1000px) {
        :root {
            --panel-margin: 1rem;
        }
        div {
            grid-template-columns: 1fr;
        }
    }
    /* @media screen and (max-width: 500px) {
        div {
            width: calc(100% - (0 * var(--panel-margin)));
        }
    } */
</style>
