type FieldValue = import('firebase/firestore').FieldValue;
type Timestamp = import('firebase/firestore').Timestamp;
type User = import('firebase/auth').User;
type Auth = import('firebase/auth').Auth;

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
    hasCashedOut: boolean;
}

interface SellerDocumentFull extends SellerDocument {
    id: string;
}

interface TextbookDataForm {
    title: string;
    price: number;
    condition: TextbookCondition;
}

interface TextbookDocument extends TextbookDataForm, Creator {
    createdAt: FieldValue;
    sold: boolean;
    soldAt: Timestamp;
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

type TextbookCondition = 1 | 2 | 3 | 4;

interface BackupDocument {
    createdAt: Timestamp;
    status: 'pending' | 'complete' | 'failed';
    type: 'scheduled' | 'manual';
}

interface TitleDocument extends Creator {
    name: string;
    createdAt: FieldValue;
}

interface TitleDocumentFull extends TitleDocument {
    id: string;
}
