<script lang="ts">
    let hidden = true;

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
</script>

<svelte:window on:scroll={() => (hidden = window.scrollY <= 500)} />
<div class:visible={!hidden}>
    <button on:click={scrollToTop}>
        <svg xmlns="http://www.w3.org/2000/svg" height="5em" viewBox="0 0 512 512">
            <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4l107.1-99.9c3.8-3.5 8.7-5.5 13.8-5.5s10.1 2 13.8 5.5l107.1 99.9c4.5 4.2 7.1 10.1 7.1 16.3c0 12.3-10 22.3-22.3 22.3H304v96c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256H150.3C138 256 128 246 128 233.7c0-6.2 2.6-12.1 7.1-16.3z"
            />
        </svg>
    </button>
</div>

<style>
    div {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 1rem;
        scale: 0;
        transition: scale 100ms;
        z-index: 1;
    }
    div.visible {
        scale: 1;
    }

    button {
        aspect-ratio: 1;
        background-color: transparent;
        border: none;
        border-radius: 50%;
        transition: scale 100ms ease;
    }
    button:hover {
        scale: 1.1;
    }
    button:active {
        scale: 0.9;
    }

    svg {
        height: 10vh;
        fill: var(--accent-primary);
    }
</style>
