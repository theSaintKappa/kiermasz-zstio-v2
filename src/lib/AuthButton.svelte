<script lang="ts">
    import { user } from '../stores';
    import { auth } from '../firebaseConfig';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import Swal from 'sweetalert2';
    import toast from '../utils/toast';

    async function login() {
        Swal.fire({
            title: 'Zaloguj się',
            html: `<input type="text" class="swal2-input" placeholder="Email"><input type="password" class="swal2-input" placeholder="Hasło">`,
            confirmButtonText: 'Zaloguj się',
            focusConfirm: false,
            confirmButtonColor: '#3b27be',
            background: '#191722',
            backdrop: 'transparent',
            preConfirm: async () => {
                const email = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=text]')).value;
                const password = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=password]')).value;

                if (!login || !password) Swal.showValidationMessage(`Wpisz email i hasło`);

                try {
                    await signInWithEmailAndPassword(auth, email, password);
                    toast.fire({ icon: 'success', title: 'Zalogowano pomyślnie!', timer: 2000 });
                } catch (err) {
                    if (err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password') return Swal.showValidationMessage(`Nieprawidłowy email lub hasło`);
                    Swal.showValidationMessage(`Wystąpił błąd podczas logowania`);
                }
            },
        });
    }

    async function logout() {
        await auth.signOut();
        toast.fire({ icon: 'success', title: 'Wylogowano pomyślnie!', timer: 2000 });
    }
</script>

{#if $user}
    <button on:click={logout}>Wyloguj się</button>
{:else}
    <button on:click={login}>Zaloguj się</button>
{/if}

<style>
    button {
        font-size: clamp(0.75rem, 3.75vw, 1.25rem);
        white-space: nowrap;
        font-weight: 700;
        background-color: var(--accent-secondary);
        border: 2px solid;
        border-color: var(--accent-primary);
        padding: 0.4rem 0.5rem;
        border-radius: 0.5rem;
        transition: background-color 75ms ease, scale 100ms ease, box-shadow 75ms ease;
    }

    button:hover,
    button:focus {
        background-color: var(--accent-secondary);
        box-shadow: 0 0 24px -4px var(--accent-primary);
    }

    button:active {
        scale: 0.9;
    }
</style>
