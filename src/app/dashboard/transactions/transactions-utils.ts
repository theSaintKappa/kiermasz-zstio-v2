import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import type { EducationLevel } from "@/lib/textbook-utils";

export interface TransactionItemRow {
    saleItemId: string;
    itemId: string;
    price: number;
    title: string;
    subtitle: string | null;
    isbn: string;
    publisher: string | null;
    publishingYear: number | null;
    level: EducationLevel;
    subjectName: string | null;
    coverPath: string | null;
    sellerId: string;
    sellerFirstName: string;
    sellerLastName: string;
    classSymbol: string;
}

export interface TransactionRow {
    id: string;
    soldAt: string;
    reservationId: string | null;
    items: TransactionItemRow[];
    total: number;
}

export const LEVEL_SHORT_LABELS: Record<EducationLevel, string> = {
    basic: "P",
    extended: "R",
    basic_and_extended: "P+R",
};

export const PAGE_SIZE = 25;

export function saleDayKey(soldAt: string): string {
    return format(parseISO(soldAt), "yyyy-MM-dd");
}

export function saleDayLabel(soldAt: string): string {
    const date = parseISO(soldAt);
    const formatted = format(date, "d MMMM yyyy", { locale: pl });
    if (isToday(date)) return `Dziś (${formatted})`;
    if (isTomorrow(date)) return `Jutro (${formatted})`;
    return formatted;
}

export function transactionCountLabel(n: number): string {
    if (n === 1) return "transakcja";
    if (n < 5) return "transakcje";
    return "transakcji";
}

export function textbookCountLabel(n: number): string {
    if (n === 1) return "podręcznik";
    if (n < 5) return "podręczniki";
    return "podręczników";
}
