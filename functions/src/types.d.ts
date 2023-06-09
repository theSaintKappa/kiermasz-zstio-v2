type Timestamp = import('firebase/firestore').Timestamp;

interface TextbookDocument {
    sold: boolean;
    soldAt: Timestamp;
    reservation: {
        status: boolean;
        holder: string;
        expiry: Timestamp;
    };
}

interface Backup {
    createdAt: Timestamp;
    status: 'pending' | 'complete' | 'failed';
    type: 'scheduled' | 'manual';
}
