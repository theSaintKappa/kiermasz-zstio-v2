<script lang="ts">
    import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
    import Swal from 'sweetalert2';
    import { auth } from '../firebaseConfig';
    import { lastBackup, user } from '../stores';
    import { modal, toast } from '../utils/swal';

    async function showLoginModal() {
        modal.fire({
            title: 'Zaloguj się',
            html: `<input type="text" class="swal2-input" placeholder="Email" data-form-type="username"><input type="password" class="swal2-input" placeholder="Hasło" data-form-type="password">`,
            confirmButtonText: 'Zaloguj się',
            showCancelButton: false,
            preConfirm: async () => {
                const email = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=text]')).value;
                const password = (<HTMLInputElement>Swal.getPopup().querySelector('input[type=password]')).value;

                await login(auth, email, password);
            },
        });
    }

    async function login(auth: Auth, email: string, password: string) {
        if (!login || !password) return Swal.showValidationMessage(`Wpisz email i hasło`);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.fire({ icon: 'success', title: 'Zalogowano pomyślnie!', timer: 2000 });

            if (userCredential.user.displayName !== null) return;
        } catch (err) {
            if (err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password') return Swal.showValidationMessage(`Nieprawidłowy email lub hasło`);
            Swal.showValidationMessage(`Wystąpił błąd podczas logowania`);
        }

        const result = await modal.fire({
            title: 'Cześć 👋',
            html: `<p>Ustaw swoją nazwę użytkownika aby kontynuować.</p><input class="swal2-input" data-form-type="other">`,
            showCancelButton: false,
            // backdrop: '#100f15',
            didOpen: () => (<HTMLInputElement>Swal.getPopup().querySelector('input')).focus(),
            preConfirm: () => {
                const username = (<HTMLInputElement>Swal.getPopup().querySelector('input')).value;
                if (username.length < 3) return Swal.showValidationMessage(`Nazwa użytkownika musi mieć co najmniej 3 znaki`);
                if (username.length > 16) return Swal.showValidationMessage(`Nazwa użytkownika nie może mieć więcej niż 16 znaków`);
                if (username.match(/[^a-zA-Z0-9]/g)) return Swal.showValidationMessage(`Nazwa użytkownika może zawierać tylko litery i cyfry`);

                return username;
            },
        });

        if (!result.isConfirmed) return;

        updateProfile($user, { displayName: result.value || '' }).then(() => toast.fire({ icon: 'success', title: `<strong>${result.value}, witaj na kiermaszu!</strong>`, timer: 2000 }));
    }

    async function logout() {
        await auth.signOut().then(() => toast.fire({ icon: 'success', title: 'Wylogowano pomyślnie!', timer: 2000 }));
        $lastBackup = null;
    }
</script>

{#if $user}
    <button on:click={logout} class="btn">Wyloguj się</button>
{:else}
    <button on:click={showLoginModal} class="btn">Zaloguj się</button>
{/if}

<style>
    button {
        font-size: clamp(0.75rem, 3.25vw, 1rem);
        font-weight: 700;
        transition: background-color 75ms ease, scale 100ms ease, box-shadow 75ms ease;
    }

    button:hover,
    button:focus {
        box-shadow: 0 0 24px -4px var(--accent-primary);
    }

    button:active {
        scale: 0.9;
    }
</style>
