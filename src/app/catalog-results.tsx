"use client";

import { CryingIcon, InfoIcon, Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useCatalogSearch } from "@/hooks/use-catalog-search";
import { CatalogCard } from "./catalog-card";
import { CatalogDialog } from "./catalog-dialog";
import { useCatalogContext } from "./catalog-shell";
import type { PublicCatalogRow } from "./public-catalog-utils";

interface CatalogResultsProps {
    initialRows: PublicCatalogRow[];
    initialQuery: string;
}

export function CatalogResults({ initialRows, initialQuery }: CatalogResultsProps) {
    const { query, reportCount } = useCatalogContext();
    const { rows, isLoading } = useCatalogSearch(query, initialRows, initialQuery);
    const [selectedRow, setSelectedRow] = useState<PublicCatalogRow | null>(null);

    useEffect(() => {
        reportCount(rows.length);
    }, [rows.length, reportCount]);

    const hasQuery = query.trim().length > 0;

    return (
        <>
            {/* Helper note */}
            {rows.length > 0 && (
                <p className="mx-auto flex items-center gap-1 text-center text-muted-foreground text-xs">
                    <HugeiconsIcon icon={InfoIcon} className="size-3" />
                    Kliknij w tytuł, aby zobaczyć szczegółowe informacje i dostępność.
                </p>
            )}

            {/* Grid */}
            {!hasQuery && rows.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} className="mb-3 size-8 opacity-30" />
                    <p className="text-sm">Katalog jest jeszcze pusty.</p>
                </div>
            ) : isLoading && rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <HugeiconsIcon icon={Loading03Icon} className="mb-3 size-8 animate-spin opacity-30" />
                    <p className="text-sm">Wyszukiwanie podręczników…</p>
                </div>
            ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <HugeiconsIcon icon={CryingIcon} className="mb-3 size-8 opacity-30" />
                    <p className="text-sm">Brak wyników dla &ldquo;{query}&rdquo;</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
                    {rows.map((row) => (
                        <CatalogCard key={row.id} row={row} onSelect={setSelectedRow} />
                    ))}
                </div>
            )}

            {/* Single dialog instance */}
            <CatalogDialog
                row={selectedRow}
                open={selectedRow !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedRow(null);
                }}
            />
        </>
    );
}
