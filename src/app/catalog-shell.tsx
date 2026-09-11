"use client";

import { AiSearch02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useTypewriterPlaceholder } from "@/hooks/use-typewriter-placeholder";
import { pluralize } from "./public-catalog-utils";

interface CatalogContextValue {
    query: string;
    setQuery: (q: string) => void;
    reportCount: (n: number) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function useCatalogContext() {
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error("useCatalogContext must be used within CatalogShell");
    return ctx;
}

export function useCatalogRowsContext() {
    return { query: useCatalogContext().query };
}

interface CatalogShellProps {
    initialQuery: string;
    children: React.ReactNode;
}

export function CatalogShell({ initialQuery, children }: CatalogShellProps) {
    const [query, setQuery] = useState(initialQuery);
    const [count, setCount] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const isFirstRender = useRef(true);

    const animatedPlaceholder = useTypewriterPlaceholder();

    const reportCount = useCallback((n: number) => {
        setCount(n);
    }, []);

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

    const handleClear = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    return (
        <CatalogContext.Provider value={{ query, setQuery, reportCount }}>
            <div className="flex w-full flex-col pt-5">
                {/* Sticky search bar — interactive immediately */}
                <div className="sticky top-0 z-20 bg-background/80 p-3 backdrop-blur">
                    <InputGroup className="h-12">
                        <InputGroupInput ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={animatedPlaceholder} aria-label="Szukaj podręczników" className="text-base!" autoFocus />
                        <InputGroupAddon>
                            <HugeiconsIcon icon={AiSearch02Icon} />
                        </InputGroupAddon>
                        {query && count !== null && (
                            <InputGroupAddon align="inline-end">
                                {count} {pluralize(count, "wynik", "wyniki", "wyników")}
                                <InputGroupButton size="icon-xs" onClick={handleClear}>
                                    <HugeiconsIcon icon={Cancel01Icon} />
                                </InputGroupButton>
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                </div>

                {/* Grid — streamed in via Suspense */}
                {children}
            </div>
        </CatalogContext.Provider>
    );
}
