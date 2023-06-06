<script lang="ts">
    import AuthButton from './AuthButton.svelte';
    import { user } from '../stores';
</script>

<header>
    <h1>Kiermasz ZSTiO</h1>
    <AuthButton />
    {#if $user}
        {$user.email}
    {/if}
</header>

<style>
    header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
</style>
