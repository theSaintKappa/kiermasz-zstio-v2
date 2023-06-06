<script lang="ts">
    import { user } from '../stores';
    import { auth } from '../firebaseConfig';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import Swal from 'sweetalert2';
    import toast from '../utils/toast';

    async function login() {
        Swal.fire({
            title: 'Zaloguj się do panelu admin',
            html: `<input type="text" class="swal2-input" placeholder="Email"><input type="password" class="swal2-input" placeholder="Hasło">`,
            confirmButtonText: 'Zaloguj się',
            focusConfirm: false,
            // confirmButtonColor: '#3523A9',
            backdrop: 'transparent',
            preConfirm: async () => {
                const email = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=text]')).value;
                const password = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=password]')).value;

                if (!login || !password) Swal.showValidationMessage(`Wpisz email i hasło`);

                await signInWithEmailAndPassword(auth, email, password)
                    .then(() => toast.fire({ icon: 'success', title: 'Zalogowano pomyślnie!' }))
                    .catch(() => Swal.showValidationMessage(`Nieprawidłowy email lub hasło`));
            },
        });
    }

    async function logout() {
        await auth.signOut();
        toast.fire({ icon: 'success', title: 'Wylogowano pomyślnie!' });
    }
</script>

{#if $user}
    <button on:click={logout}>Wyloguj</button>
{:else}
    <button on:click={login}>Zaloguj</button>
{/if}
