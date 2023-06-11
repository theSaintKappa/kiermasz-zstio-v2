<script lang="ts">
    import { db } from '../firebaseConfig';
    import { onSnapshot, query, collection, orderBy, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
    import { converter } from '../utils/converter';
    import { user, textbookTitles } from '../stores';
    import { onMount } from 'svelte';

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
        <input type="text" bind:this={titleInput} />
        <button class="btn btn-hover">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
        </button>
    </form>
    <div>
        {#each titles as title}
            <span>{title.name} <button on:click={() => removeTitle(title.id)}>🗑️</button></span>
        {/each}
    </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        align-items: end;
    }

    form {
        display: flex;
        justify-content: end;
    }

    input {
        border: 2px solid var(--accent-primary);
        background-color: var(--bg-secondary);
        border-radius: 1000px 0 0 1000px;
        padding: 0.5rem 1rem;
    }

    form > button {
        border-radius: 0 1000px 1000px 0;
        aspect-ratio: 1;
    }

    svg {
        height: 80%;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: end;
        padding: 1rem 0.5rem;
    }
    div > span {
        font-size: 1.15rem;
    }
    div > span > button {
        background-color: transparent;
        border: none;
    }
</style>
