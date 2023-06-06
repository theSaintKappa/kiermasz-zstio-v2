type Timestamp = import('firebase/firestore').Timestamp;

interface TextbookReservation {
    reservation: {
        status: boolean;
        holder: string;
        expiry: Date;
    };
}

interface Backup {
    createdAt: Timestamp;
    status: 'pending' | 'complete' | 'failed';
    type: 'scheduled' | 'manual';
}
