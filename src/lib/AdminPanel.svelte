<script lang="ts">
    import AddSeller from './AddSeller.svelte';
    import BackupInfo from './BackupInfo.svelte';
    import SellersTable from './SellerList.svelte';

    // import { httpsCallable } from 'firebase/functions';
    // import { functions } from '../firebaseConfig';
    // function _sendEmail() {
    //     const sendEmail = httpsCallable(functions, 'sendEmail');
    //     sendEmail({ to: 'kiermasz.zstio@gmail.com', subject: 'test', html: '<b>hello!</b>' });
    // }
</script>

<AddSeller />
<SellersTable />
<BackupInfo />
<!-- <button on:click={_sendEmail}>send email</button> -->
