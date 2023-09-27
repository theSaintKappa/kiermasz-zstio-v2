<script lang="ts">
    let expanded = false;

    function toggleExpand() {
        expanded = !expanded;
        for (const details of document.querySelectorAll('details')) details.open = expanded;
    }
</script>

<button on:click={toggleExpand} class="btn btn-hover" aria-label="Rozwiń wszystkich sprzedawców">
    <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512" style="rotate: {expanded ? '-180deg' : '0deg'};">
        <path
            d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"
        />
    </svg>
</button>

<style>
    button {
        height: 100%;
        aspect-ratio: 1;
    }

    svg {
        transition: rotate 150ms ease;
        height: 85%;
    }
</style>
