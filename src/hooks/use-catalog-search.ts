"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicCatalogRow } from "@/app/public-catalog-utils";
import { createClient } from "@/lib/supabase/client";

const ISBN_PATTERN = /^\d{9,13}[X\d]?$/i;
const DEBOUNCE_MS = 250;

function cleanQuery(q: string): string {
    return q.replace(/[\s]+/g, " ").trim();
}

export function useCatalogSearch(query: string, initialRows: PublicCatalogRow[]) {
    const [rows, setRows] = useState<PublicCatalogRow[]>(initialRows);
    const [isLoading, setIsLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastQueryRef = useRef<string>("");

    const fetchResults = useCallback(async (q: string) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        lastQueryRef.current = q;

        setIsLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase.rpc("search_public_catalog", {
                p_query: q,
            });

            if (controller.signal.aborted) return;
            if (error) {
                console.error("Public catalog search error:", error.message);
                return;
            }

            setRows((data as PublicCatalogRow[]) ?? []);
        } catch {
            // aborted or network error
        } finally {
            if (!controller.signal.aborted) setIsLoading(false);
        }
    }, []);

    const refresh = useCallback(() => {
        if (lastQueryRef.current) fetchResults(lastQueryRef.current);
    }, [fetchResults]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const cleaned = cleanQuery(query);
        // Skip fetching on first render with the same query as initialRows (already have data)
        if (cleaned === lastQueryRef.current) return;

        setIsLoading(true);

        // ISBN fast-path (barcode scanner / USB wedge)
        const digitsOnly = cleaned.replace(/[\s-]/g, "");
        if (ISBN_PATTERN.test(digitsOnly)) {
            fetchResults(digitsOnly);
            return;
        }

        timerRef.current = setTimeout(() => {
            fetchResults(cleaned);
        }, DEBOUNCE_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query, fetchResults]);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { rows, isLoading, refresh };
}
