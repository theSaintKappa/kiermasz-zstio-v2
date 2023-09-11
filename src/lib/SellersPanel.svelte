<script lang="ts">
    import AccordionButtons from './AccordionButtons.svelte';
    import AddSeller from './AddSeller.svelte';
    import BackupButton from './BackupButton.svelte';
    import BackupInfo from './BackupInfo.svelte';
    import SellerList from './SellerList.svelte';
</script>

<section>
    <div>
        <AddSeller />
        <AccordionButtons />
        <BackupButton />
    </div>
    <SellerList />
    <BackupInfo />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 1rem;
    }

    div {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    @media screen and (max-width: 1000px) {
        div {
            justify-content: center;
        }
    }
</style>
