<script lang="ts">
    import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { db } from '../../firebaseConfig';
    import { textbookTitles, user, writingDisabled } from '../../stores';
    import { converter } from '../../utils/converter';

    let titles: TitleDocumentFull[] = [];

    onMount(() => {
        const q = query(collection(db, 'titles'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q.withConverter(converter<TitleDocument>()), (snapshot) => {
            let titlesSnapshot: TitleDocumentFull[] = [];
            let titleNames: string[] = [];
            for (const doc of snapshot.docs) {
                titlesSnapshot.push({ ...doc.data(), id: doc.id });
                titleNames.push(doc.data().name);
            }
            titles = titlesSnapshot;
            $textbookTitles = titleNames;
        });

        return () => unsubscribe();
    });

    let titleInput: HTMLInputElement;

    async function addTitle() {
        const titleDocument: TitleDocument = {
            name: titleInput.value,
            createdAt: serverTimestamp(),
            creator: {
                uid: $user.uid,
                email: $user.email,
            },
        };
        addDoc(collection(db, 'titles'), titleDocument);
        titleInput.value = '';
        titleInput.focus();
    }

    async function removeTitle(id: string) {
        await deleteDoc(doc(db, 'titles', id));
    }
</script>

<section>
    <form on:submit|preventDefault={addTitle}>
        <input type="text" bind:this={titleInput} placeholder="Dodaj nazwę podręcznika" />
        <button class="btn btn-hover" disabled={$writingDisabled || null}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 448 512">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
        </button>
    </form>
    <div>
        {#each titles as title}
            <span>{title.name} <button on:click={() => removeTitle(title.id)} disabled={$writingDisabled || null} aria-label="Usuń tytuł">🗑️</button></span>
        {/each}
    </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 1rem;
        /* position: relative; */
    }

    form {
        display: flex;
        width: 100%;
        justify-content: end;
    }

    input {
        border: 2px solid var(--accent-primary);
        background-color: var(--bg-secondary);
        border-radius: 0.5rem 0 0 0.5rem;
        padding: 0.5rem 1rem;
        width: 75%;
    }

    form > button {
        border-radius: 0 0.5rem 0.5rem 0;
        aspect-ratio: 1;
    }

    @media screen and (max-width: 1000px) {
        section {
            align-items: center;
        }
        section::before {
            content: '';
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background-color: var(--accent-primary);
        }
        form {
            justify-content: center;
        }
        div {
            align-items: center !important;
        }
        div > span {
            text-align: center !important;
        }
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 0.5rem;
    }
    div > span {
        text-align: end;
        text-wrap: balance;
    }
    div > span > button {
        background-color: transparent;
        border: none;
    }
</style>
