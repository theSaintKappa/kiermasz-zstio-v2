"use client";

import { BookImageIcon, FireIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-utils";
import { getCoverUrl } from "@/lib/storage-utils";
import { cn } from "@/lib/utils";
import type { PublicCatalogRow } from "./public-catalog-utils";
import { formatDayDate, isHotTitle, LEVEL_LABELS, pluralize } from "./public-catalog-utils";

interface CatalogCardProps {
    row: PublicCatalogRow;
    onSelect: (row: PublicCatalogRow) => void;
}

export function CatalogCard({ row, onSelect }: CatalogCardProps) {
    const coverUrl = getCoverUrl(row.coverPath);
    const hasStock = row.availableCount > 0;
    const hot = isHotTitle(row);
    const authorsText = row.authors?.length ? row.authors.join(", ") : null;

    return (
        <button type="button" onClick={() => onSelect(row)} className="group/card relative flex flex-col rounded-xl border bg-card text-left transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2">
            <div className="relative aspect-210/297 overflow-hidden rounded-t-xl bg-muted/50">
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={row.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 17vw"
                        className={cn("object-cover transition-all duration-300 group-hover/card:scale-105 group-hover/card:blur-[2px] group-hover/card:brightness-50", row.availableCount === 0 && "grayscale")}
                    />
                ) : (
                    <div className="flex size-full items-center justify-center">
                        <HugeiconsIcon icon={BookImageIcon} className="size-10 text-muted-foreground/40" />
                    </div>
                )}
                {/* Always-visible badges */}
                <div className="pointer-events-none absolute top-1.5 left-1.5 space-y-px">
                    <div className="space-x-0.5">
                        {hasStock && (
                            <Badge variant="secondary">
                                {row.availableCount} {pluralize(row.availableCount, "egzemplarz", "egzemplarze", "egzemplarzy")}
                            </Badge>
                        )}
                        {row.priceFrom != null ? <Badge variant="default">od {formatPrice(row.priceFrom)}</Badge> : <Badge variant="secondary">Brak ofert</Badge>}
                    </div>
                    {hot && (
                        <Badge className="pointer-events-none gap-1 border-0 bg-orange-500 text-white hover:bg-orange-500">
                            <HugeiconsIcon icon={FireIcon} strokeWidth={2} />
                            <span className="sr-only">Wysoki popyt</span>
                        </Badge>
                    )}
                </div>
                {/* Hover overlay */}
                <div className="opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 via-black/10 to-transparent p-3">
                        <div className="text-white text-xs">
                            <div className="text-[10px] text-white/80 uppercase tracking-wider">Poziom</div>
                            <div>{LEVEL_LABELS[row.level] ?? row.level}</div>
                        </div>
                        {authorsText && (
                            <div className="mt-1.5 text-white text-xs">
                                <div className="text-[10px] text-white/80 uppercase tracking-wider">Autorzy</div>
                                <div className="line-clamp-2">{authorsText}</div>
                            </div>
                        )}
                        <div className="mt-1.5 flex flex-wrap gap-x-3 text-white text-xs">
                            {row.publisher && (
                                <div>
                                    <span className="text-[10px] text-white/80 uppercase tracking-wider">Wydawca: </span>
                                    {row.publisher}
                                </div>
                            )}
                            {row.publishingYear && (
                                <div>
                                    <span className="text-[10px] text-white/80 uppercase tracking-wider">Rok: </span>
                                    {row.publishingYear}
                                </div>
                            )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1 text-white text-xs">
                            <div className="text-[10px] text-white/80 uppercase tracking-wider">ISBN</div>
                            <div className="font-mono">{row.isbn}</div>
                        </div>
                        {row.soldCount > 0 && <div className="mt-1.5 text-[10px] text-white/70">Sprzedanych: {row.soldCount}</div>}
                        {row.lastSoldAt && <div className="text-[10px] text-white/70">Ostatnia sprzedaż: {formatDayDate(row.lastSoldAt)}</div>}
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-2.5">
                <span className="line-clamp-2 font-medium text-sm leading-snug">{row.title}</span>
                {row.subtitle && <span className="line-clamp-2 text-muted-foreground text-xs leading-snug">{row.subtitle}</span>}
                {row.subjectName && (
                    <Badge variant="outline" className="mt-auto w-fit text-[10px]">
                        {row.subjectName}
                    </Badge>
                )}
            </div>
        </button>
    );
}
