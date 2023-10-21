<script lang="ts">
    import { writingDisabled } from "../../stores";
    import BackToTopButton from "./BackToTopButton.svelte";
    import EOL from "./EOL.svelte";
    import SearchBar from "./SearchBar.svelte";
    import TextbookGrid from "./TextbookGrid.svelte";
</script>

<svelte:head><title>Kiermasz ZSTiO</title></svelte:head>
{#if !$writingDisabled}
    <div>
        <SearchBar />
        <TextbookGrid />
    </div>
{:else}
    <EOL />
{/if}
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

    div {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 1.5rem 0 5rem;
        gap: var(--panel-margin);
    }
</style>
