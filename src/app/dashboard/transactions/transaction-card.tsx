"use client";

import { BarcodeIcon, BookImageIcon, BookUserIcon, Building06Icon, CalendarMortarboardIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-utils";
import { getCoverUrl } from "@/lib/storage-utils";
import { cn } from "@/lib/utils";
import { LEVEL_SHORT_LABELS, type TransactionItemRow, type TransactionRow, textbookCountLabel } from "./transactions-utils";

interface TransactionCardProps {
    transaction: TransactionRow;
    highlightedItemIds: Set<string>;
    onUndoSale: (t: TransactionRow) => void;
    onUndoItem: (i: TransactionItemRow) => void;
}

export function TransactionCard({ transaction, highlightedItemIds, onUndoSale, onUndoItem }: TransactionCardProps) {
    const hasHighlights = highlightedItemIds.size > 0;

    return (
        <div className={cn("flex flex-col rounded-lg border bg-card", hasHighlights && "border-amber-400/60 ring-1 ring-amber-400/30 dark:border-amber-600/50 dark:ring-amber-600/20")}>
            {/* Header */}
            <div className="flex items-center gap-4 border-b px-4 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold font-mono text-xl tracking-wider">{new Date(transaction.soldAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="font-medium text-muted-foreground text-xs">{new Date(transaction.soldAt).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                    </div>
                    {transaction.reservationId && (
                        <Badge variant="secondary" className="text-xs">
                            Z rezerwacji
                        </Badge>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-semibold">{formatPrice(transaction.total)}</span>
                    <span className="text-muted-foreground text-xs">
                        {transaction.items.length} {textbookCountLabel(transaction.items.length)}
                    </span>
                </div>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => onUndoSale(transaction)}>
                    <HugeiconsIcon icon={Delete02Icon} />
                    Usuń
                </Button>
            </div>

            {/* Items */}
            <div className="divide-y">
                {transaction.items.map((item) => {
                    const coverUrl = getCoverUrl(item.coverPath);
                    const isHighlighted = highlightedItemIds.has(item.saleItemId);
                    return (
                        <div key={item.saleItemId} className={cn("flex items-center gap-2.5 px-4 py-2", isHighlighted && "bg-amber-100/70 dark:bg-amber-900/25")}>
                            {/* Cover */}
                            <div className="aspect-210/297 h-14">
                                {coverUrl ? (
                                    <Image src={coverUrl} alt={item.title} width={64} height={88} className="size-full shrink-0 rounded object-cover" />
                                ) : (
                                    <div className="flex size-full shrink-0 items-center justify-center rounded border border-dashed bg-muted">
                                        <HugeiconsIcon icon={BookImageIcon} className="size-5 text-muted-foreground/40" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-sm">{item.title}</span>
                                    {item.level !== "basic" && (
                                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                                            {LEVEL_SHORT_LABELS[item.level]}
                                        </Badge>
                                    )}
                                </div>
                                {item.subtitle && <p className="truncate text-muted-foreground text-xs">{item.subtitle}</p>}
                                <div className="flex flex-wrap items-center gap-x-2 text-muted-foreground text-xs">
                                    {item.publisher && (
                                        <span className="flex items-center gap-0.5">
                                            <HugeiconsIcon className="size-2.5" icon={Building06Icon} />
                                            {item.publisher}
                                        </span>
                                    )}
                                    {item.publishingYear && (
                                        <span className="flex items-center gap-0.5">
                                            <HugeiconsIcon className="size-2.5" icon={CalendarMortarboardIcon} />
                                            {item.publishingYear}
                                        </span>
                                    )}
                                    {item.isbn && (
                                        <span className="flex items-center gap-0.5 font-mono">
                                            <HugeiconsIcon className="size-2.5" icon={BarcodeIcon} />
                                            {item.isbn}
                                        </span>
                                    )}
                                    <Link href={`/dashboard/inventory/${item.sellerId}`} className="flex items-center gap-0.5 font-medium hover:underline">
                                        <HugeiconsIcon className="size-2.5" icon={BookUserIcon} />
                                        {item.sellerFirstName} {item.sellerLastName}
                                        <span className="text-muted-foreground">{item.classSymbol}</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Price + per-item undo */}
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="font-medium text-sm">{formatPrice(item.price)}</span>
                                <Button size="icon-xs" variant="ghost" className="text-muted-foreground hover:text-destructive" aria-label="Usuń podręcznik z transakcji" onClick={() => onUndoItem(item)}>
                                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
