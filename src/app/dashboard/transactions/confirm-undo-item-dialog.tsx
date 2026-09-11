"use client";

import { Alert02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { undoSaleItem } from "@/actions/sale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { TransactionItemRow } from "./transactions-utils";

interface ConfirmUndoItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: TransactionItemRow | null;
}

export function ConfirmUndoItemDialog({ open, onOpenChange, item }: ConfirmUndoItemDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (!open) setError(null);
        onOpenChange(open);
    };

    const handleUndo = async () => {
        if (!item) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await undoSaleItem(item.saleItemId);
            handleOpenChange(false);
            toast.success("Podręcznik przywrócony.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <HugeiconsIcon icon={Alert02Icon} />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Usuń podręcznik z transakcji</AlertDialogTitle>
                    <AlertDialogDescription>
                        Na pewno chcesz usunąć podręcznik <span className="font-medium text-foreground">{item?.title}</span>
                        {item?.sellerFirstName && (
                            <>
                                {" "}
                                od{" "}
                                <span className="font-medium text-foreground">
                                    {item.sellerFirstName} {item.sellerLastName} {item.classSymbol}
                                </span>
                            </>
                        )}
                        ? Podręcznik wróci do statusu „Dostępny". Tej operacji nie można cofnąć.
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
