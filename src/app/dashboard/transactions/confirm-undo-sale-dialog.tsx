"use client";

import { Alert02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { undoSale } from "@/actions/sale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatDateTime, formatPrice } from "@/lib/format-utils";
import { type TransactionRow, textbookCountLabel, transactionCountLabel } from "./transactions-utils";

interface ConfirmUndoSaleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: TransactionRow | null;
}

export function ConfirmUndoSaleDialog({ open, onOpenChange, transaction }: ConfirmUndoSaleDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (!open) setError(null);
        onOpenChange(open);
    };

    const handleUndo = async () => {
        if (!transaction) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await undoSale(transaction.id);
            handleOpenChange(false);
            toast.success("Transakcja usunięta, podręczniki przywrócone.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const count = transaction?.items.length ?? 0;
    const total = transaction?.total ?? 0;

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <HugeiconsIcon icon={Alert02Icon} />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Usuń transakcję</AlertDialogTitle>
                    <AlertDialogDescription>
                        Na pewno chcesz usunąć transakcję z {transaction ? formatDateTime(transaction.soldAt) : ""} o wartości <span className="font-bold">{formatPrice(total)}</span> ({count} {textbookCountLabel(count)})? {count} {transactionCountLabel(count)} {count === 1 ? "wróci" : "wróci"} do statusu „Dostępny".
                        Tej operacji nie można cofnąć.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Anuluj</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleUndo} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
                                Usuwanie...
                            </>
                        ) : (
                            "Usuń"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
