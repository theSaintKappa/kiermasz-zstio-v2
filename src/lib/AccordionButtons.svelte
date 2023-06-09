<script lang="ts">
    function expandAll() {
        for (const details of document.querySelectorAll('details')) {
            details.open = true;
        }
    }

    function collapseAll() {
        for (const details of document.querySelectorAll('details')) {
            details.open = false;
        }
    }
</script>

<div>
    <button on:click={expandAll} aria-label="rozwiń wszystkie" class="btn btn-hover">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path
                d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"
            />
        </svg>
    </button>
    <button on:click={collapseAll} aria-label="zwiń wszystkie" class="btn btn-hover">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" style="transform: rotate(180deg);">
            <path
                d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"
            />
        </svg>
    </button>
</div>

<style>
    div {
        display: flex;
        height: 100%;
    }

    button {
        height: 100%;
        padding: 0;
        aspect-ratio: 1;
        transition: background-color 75ms ease;
    }

    button:first-of-type {
        border-radius: 0.5rem 0 0 0.5rem;
        border-right-width: 1px;
    }
    button:last-of-type {
        border-radius: 0 0.5rem 0.5rem 0;
        border-left-width: 1px;
    }

    svg {
        height: 65%;
    }
</style>
