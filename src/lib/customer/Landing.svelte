<script lang="ts">
    import BackToTopButton from './BackToTopButton.svelte';
    import SearchBar from './SearchBar.svelte';
    import TextbookGrid from './TextbookGrid.svelte';
</script>

<svelte:head><title>Kiermasz ZSTiO</title></svelte:head>
<div>
    <SearchBar />
    <TextbookGrid />
</div>
<BackToTopButton />

<style>
    :root {
        --panel-margin: 1rem;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--panel-margin);
        width: calc(100% - (2 * var(--panel-margin)));
        margin: var(--panel-margin) 0 calc(var(--panel-margin) * 6);
    }
</style>
