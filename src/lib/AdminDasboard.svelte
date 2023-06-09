<script lang="ts">
    import SellersPanel from './SellersPanel.svelte';
    import TextbooksPanel from './TextbooksPanel.svelte';

    // import { httpsCallable } from 'firebase/functions';
    // import { functions } from '../firebaseConfig';
    // function _sendEmail() {
    //     const sendEmail = httpsCallable(functions, 'sendEmail');
    //     sendEmail({ to: 'kiermasz.zstio@gmail.com', subject: 'test', html: '<b>hello!</b>' });
    // }
</script>

<main>
    <SellersPanel />
    <TextbooksPanel />
</main>

<!-- <button on:click={_sendEmail}>send email</button> -->

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
        /* grid-template-columns: 100%; */
    }
</style>
