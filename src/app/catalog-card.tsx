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
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 17vw"
                        className={cn("object-cover brightness-50 sm:brightness-100 sm:transition-all sm:duration-300 sm:group-hover/card:scale-105 sm:group-hover/card:blur-[2px] sm:group-hover/card:brightness-50", row.availableCount === 0 && "grayscale")}
                    />
                ) : (
                    <div className="flex size-full items-center justify-center">
                        <HugeiconsIcon icon={BookImageIcon} className="size-10 text-muted-foreground/40" />
                    </div>
                )}
                {/* Always-visible badges */}
                <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1">
                    {hasStock && (
                        <Badge variant="secondary">
                            {row.availableCount} {pluralize(row.availableCount, "egzemplarz", "egzemplarze", "egzemplarzy")}
                        </Badge>
                    )}
                    {row.priceFrom != null ? <Badge variant="default">od {formatPrice(row.priceFrom)}</Badge> : <Badge variant="secondary">Brak ofert</Badge>}
                </div>
                {/* Hover overlay (desktop) */}
                <div className="opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover/card:opacity-100">
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
                {/* Fire badge for high demand */}
                {hot && (
                    <Badge className="pointer-events-none absolute top-2 right-2 gap-1 border-0 bg-orange-500 text-white hover:bg-orange-500">
                        <HugeiconsIcon icon={FireIcon} className="size-3" />
                        <span className="sr-only">Wysoki popyt</span>
                    </Badge>
                )}
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
