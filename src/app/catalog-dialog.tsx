"use client";

import { BookImageIcon, FireIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime, formatPrice } from "@/lib/format-utils";
import { getCoverUrl } from "@/lib/storage-utils";
import type { PublicCatalogItem, PublicCatalogRow } from "./public-catalog-utils";
import { formatDayDate, isHotTitle, LEVEL_LABELS, pluralize } from "./public-catalog-utils";

interface CatalogDialogProps {
    row: PublicCatalogRow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CatalogDialog({ row, open, onOpenChange }: CatalogDialogProps) {
    if (!row) return null;

    const coverUrl = getCoverUrl(row.coverPath);
    const authorsText = row.authors?.length ? row.authors.join(", ") : null;
    const hot = isHotTitle(row);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <div className="flex flex-col gap-6 sm:flex-row">
                    {/* Cover */}
                    <div className="relative aspect-210/297 w-40 shrink-0 overflow-hidden rounded-lg bg-muted/50 sm:w-52">
                        {coverUrl ? (
                            <Image src={coverUrl} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw" className="object-cover" />
                        ) : (
                            <div className="flex size-full items-center justify-center">
                                <HugeiconsIcon icon={BookImageIcon} className="size-10 text-muted-foreground/40" />
                            </div>
                        )}
                    </div>
                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold font-heading text-xl">{row.title}</h2>
                                {hot && (
                                    <Badge className="gap-1 border-0 bg-orange-500 text-white hover:bg-orange-500">
                                        <HugeiconsIcon icon={FireIcon} className="size-3" />
                                        Wysoki popyt
                                    </Badge>
                                )}
                            </div>
                            {row.subtitle && <p className="text-muted-foreground">{row.subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {row.subjectName && <Badge variant="outline">{row.subjectName}</Badge>}
                            <Badge variant="secondary">{LEVEL_LABELS[row.level] ?? row.level}</Badge>
                        </div>
                        <div className="space-y-1">
                            {row.publisher && (
                                <div>
                                    <span className="text-muted-foreground text-xs">Wydawca: </span>
                                    {row.publisher}
                                </div>
                            )}
                            {row.publishingYear && (
                                <div>
                                    <span className="text-muted-foreground text-xs">Rok wydania: </span>
                                    {row.publishingYear}
                                </div>
                            )}
                            {authorsText && (
                                <div className="line-clamp-3">
                                    <span className="text-muted-foreground text-xs">Autorzy: </span>
                                    {authorsText}
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground text-xs">ISBN: </span>
                                <span className="font-mono">{row.isbn}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div>
                                <span className="text-muted-foreground text-xs">Dostępne: </span>
                                {row.availableCount} szt.
                            </div>
                            <div>
                                <span className="text-muted-foreground text-xs">Sprzedane: </span>
                                {row.soldCount} szt.
                            </div>
                            {row.items.length > 1 && row.priceFrom !== null && row.priceTo !== null && row.priceAvg !== null && (
                                <>
                                    <div>
                                        <span className="text-muted-foreground text-xs">Cena: </span>
                                        od {formatPrice(row.priceFrom)} do {formatPrice(row.priceTo)}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground text-xs">Średnia cena: </span>
                                        {formatPrice(row.priceAvg)}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-1">
                            {row.lastSoldAt && (
                                <div>
                                    <span className="text-muted-foreground text-xs">Ostatnia sprzedaż: </span>
                                    {formatDateTime(row.lastSoldAt)}
                                </div>
                            )}
                            {row.recentSoldCount > 0 && (
                                <div>
                                    <span className="text-muted-foreground text-xs">Sprzedane w 24h: </span>
                                    {row.recentSoldCount} {pluralize(row.recentSoldCount, "egzemplarz", "egzemplarze", "egzemplarzy")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Available items */}
                <div>
                    <h3 className="mb-2 font-semibold">Dostępne egzemplarze ({row.items.length})</h3>
                    {row.items.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Brak dostępnych egzemplarzy.</p>
                    ) : (
                        <div className="scroll-fade max-h-54 overflow-y-auto rounded-md border">
                            <Table>
                                <TableBody>
                                    {row.items.map((item: PublicCatalogItem) => (
                                        <TableRow key={`${item.price}-${item.createdAt}-${item.sellerFirstName}-${item.sellerClassSymbol}`}>
                                            <TableCell>
                                                <span className="font-semibold">{item.sellerFirstName}</span> <span className="text-muted-foreground text-xs">{item.sellerClassSymbol || ""}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{formatDayDate(item.createdAt)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatPrice(item.price)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
