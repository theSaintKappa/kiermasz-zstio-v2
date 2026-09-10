"use client";

import { AiSearch02Icon, Cancel01Icon, CryingIcon, InfoIcon, Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useCatalogSearch } from "@/hooks/use-catalog-search";
import { useTypewriterPlaceholder } from "@/hooks/use-typewriter-placeholder";
import { CatalogCard } from "./catalog-card";
import { CatalogDialog } from "./catalog-dialog";
import type { PublicCatalogRow } from "./public-catalog-utils";
import { pluralize } from "./public-catalog-utils";

interface CatalogViewProps {
    initialRows: PublicCatalogRow[];
    initialQuery: string;
}

export function CatalogView({ initialRows, initialQuery }: CatalogViewProps) {
    const [query, setQuery] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    const { rows, isLoading } = useCatalogSearch(query, initialRows);
    const animatedPlaceholder = useTypewriterPlaceholder();

    const [selectedRow, setSelectedRow] = useState<PublicCatalogRow | null>(null);

    // Focus searchbar on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Sync query to URL — debounced, skip first render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (query.trim()) params.set("q", query);
            const qs = params.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, pathname, router]);

    const hasQuery = query.trim().length > 0;

    const handleSearchbarClear = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    return (
        <div className="flex w-full flex-col">
            {/* Sticky search bar */}
            <div className="sticky top-0 z-20 bg-background/80 p-3 backdrop-blur">
                <InputGroup className="h-12">
                    <InputGroupInput ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={animatedPlaceholder} aria-label="Szukaj podręczników" className="text-base!" autoFocus />
                    <InputGroupAddon>
                        <HugeiconsIcon icon={AiSearch02Icon} />
                    </InputGroupAddon>
                    {query && (
                        <InputGroupAddon align="inline-end">
                            {rows.length} {pluralize(rows.length, "wynik", "wyniki", "wyników")}
                            <InputGroupButton size="icon-xs" onClick={handleSearchbarClear}>
                                <HugeiconsIcon icon={Cancel01Icon} />
                            </InputGroupButton>
                        </InputGroupAddon>
                    )}
                </InputGroup>
            </div>

            {rows.length !== 0 && (
                <p className="mx-auto flex items-center gap-1 text-center text-muted-foreground text-xs">
                    <HugeiconsIcon icon={InfoIcon} className="size-3" />
                    Kliknij w tytuł, aby zobaczyć szczegółowe informacje i dostępność.
                </p>
            )}

            {/* Results */}
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
        </div>
    );
}
