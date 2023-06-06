type FieldValue = import('firebase/firestore').FieldValue;
type Timestamp = import('firebase/firestore').Timestamp;
type User = import('firebase/auth').User;

interface Creator {
    creator: {
        uid: string;
        email: string;
    };
}

interface SellerDataForm {
    firstName: string;
    lastName: string;
    classSymbol: string;
    email: string;
}

interface SellerDocument extends SellerDataForm, Creator {
    createdAt: FieldValue;
}

interface SellerDocumentFull extends SellerDocument {
    id: string;
}

interface TextbookDataForm {
    title: string;
    price: number;
    condition: BookCondition;
}

interface TextbookDocument extends TextbookDataForm, Creator {
    createdAt: FieldValue;
    sold: boolean;
    sellerEmailName: string;
    email: string;
    reservation: {
        status: boolean;
        holder: string;
        expiry: Timestamp;
    };
    parentId: string;
}

interface TextbookDocumentFull extends TextbookDocument {
    id: string;
}

type BookCondition = 1 | 2 | 3 | 4 | 5;

interface Backup {
    createdAt: Timestamp;
    status: 'pending' | 'complete' | 'failed';
    type: 'scheduled' | 'manual';
}
