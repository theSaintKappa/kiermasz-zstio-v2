import type { QueryDocumentSnapshot } from 'firebase/firestore';

export const converter = <T>() => ({
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});
