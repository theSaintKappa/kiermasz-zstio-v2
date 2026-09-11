"use client";

import { AiSearch02Icon, ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, CryingIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useEventStore } from "@/stores/event-store";
import { ConfirmUndoItemDialog } from "./confirm-undo-item-dialog";
import { ConfirmUndoSaleDialog } from "./confirm-undo-sale-dialog";
import { TransactionCard } from "./transaction-card";
import { PAGE_SIZE, saleDayKey, saleDayLabel, type TransactionItemRow, type TransactionRow, transactionCountLabel } from "./transactions-utils";

interface TransactionsViewProps {
    transactions: TransactionRow[];
    totalCount: number;
    page: number;
    query: string;
    highlights: Record<string, string[]>;
    dayCounts: Record<string, number>;
}

export function TransactionsView({ transactions, totalCount, page, query, highlights, dayCounts }: TransactionsViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedEventId = useEventStore((s) => s.selectedEventId);
    const [isPending, startTransition] = useTransition();

    const [queryState, setQueryState] = useState(query);
    const isFirstRender = useRef(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const [undoSaleTarget, setUndoSaleTarget] = useState<TransactionRow | null>(null);
    const [undoItemTarget, setUndoItemTarget] = useState<TransactionItemRow | null>(null);

    const hasQuery = query.trim().length > 0;

    // Sync query to URL ?q=... — debounced, skip first render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            const qs = queryState.trim() ? `?q=${encodeURIComponent(queryState.trim())}` : "";
            router.replace(`${pathname}${qs}`, { scroll: false });
        }, 300);
        return () => clearTimeout(timer);
    }, [queryState, pathname, router]);

    // Realtime: refresh when sales or sale_items change
    useEffect(() => {
        if (!selectedEventId) return;
        const supabase = createClient();
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        const refresh = () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => router.refresh(), 500);
        };
        const channel = supabase.channel("transactions-realtime").on("postgres_changes", { event: "*", schema: "public", table: "sales" }, refresh).on("postgres_changes", { event: "*", schema: "public", table: "sale_items" }, refresh).subscribe();
        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            supabase.removeChannel(channel);
        };
    }, [selectedEventId, router]);

    const handleSearchbarClear = () => {
        setQueryState("");
        inputRef.current?.focus();
    };

    const gotoPage = (n: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (n > 0) {
            params.set("page", String(n));
        } else {
            params.delete("page");
        }
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    // Group by day (list mode) or flat (search mode)
    const groups = hasQuery
        ? null
        : (() => {
              const map = new Map<string, TransactionRow[]>();
              for (const t of transactions) {
                  const key = saleDayKey(t.soldAt);
                  const arr = map.get(key);
                  if (arr) arr.push(t);
                  else map.set(key, [t]);
              }
              return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
          })();

    const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Searchbar */}
            <InputGroup className="h-12">
                <InputGroupInput ref={inputRef} value={queryState} onChange={(e) => setQueryState(e.target.value)} placeholder="Nazwisko, klasa, tytuł, przedmiot lub ISBN…" className="text-base!" />
                <InputGroupAddon>
                    <HugeiconsIcon icon={AiSearch02Icon} />
                </InputGroupAddon>
                {hasQuery && (
                    <InputGroupAddon align="inline-end">
                        {totalCount} {transactionCountLabel(totalCount)}
                        <InputGroupButton size="icon-xs" onClick={handleSearchbarClear}>
                            <HugeiconsIcon icon={Cancel01Icon} />
                        </InputGroupButton>
                    </InputGroupAddon>
                )}
            </InputGroup>

            {/* Content */}
            <div className={isPending ? "opacity-50 transition-opacity" : ""}>
                {!hasQuery && transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <HugeiconsIcon icon={CryingIcon} className="mb-3 size-8 opacity-30" />
                        <p className="text-sm">Brak transakcji.</p>
                    </div>
                ) : hasQuery && transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <HugeiconsIcon icon={CryingIcon} className="mb-3 size-8 opacity-30" />
                        <p className="text-sm">Brak wyników dla &ldquo;{query}&rdquo;</p>
                    </div>
                ) : hasQuery ? (
                    /* Search results — flat list */
                    <div className="flex flex-col gap-3">
                        {transactions.map((t) => (
                            <TransactionCard key={t.id} transaction={t} highlightedItemIds={new Set(highlights[t.id] ?? [])} onUndoSale={setUndoSaleTarget} onUndoItem={setUndoItemTarget} />
                        ))}
                    </div>
                ) : (
                    /* List mode — grouped by day */
                    <div className="flex flex-col gap-8">
                        {groups?.map(([dayKey, dayTransactions]) => (
                            <section key={dayKey}>
                                <h3 className="mb-3 flex items-end justify-between font-semibold text-lg">
                                    {saleDayLabel(dayTransactions[0].soldAt)}
                                    <span className="font-normal text-muted-foreground text-sm">
                                        {dayCounts[dayKey] ?? dayTransactions.length} {transactionCountLabel(dayCounts[dayKey] ?? dayTransactions.length)}
                                    </span>
                                </h3>
                                <Separator className="mb-4" />
                                <div className="flex flex-col gap-3">
                                    {dayTransactions.map((t) => (
                                        <TransactionCard key={t.id} transaction={t} highlightedItemIds={new Set(highlights[t.id] ?? [])} onUndoSale={setUndoSaleTarget} onUndoItem={setUndoItemTarget} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination — list mode only */}
            {!hasQuery && totalCount > PAGE_SIZE && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" disabled={page === 0} onClick={() => gotoPage(page - 1)}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
                    </Button>
                    <span className="text-muted-foreground text-sm tabular-nums">
                        Strona {page + 1} z {pageCount}
                    </span>
                    <Button variant="ghost" size="icon" disabled={(page + 1) * PAGE_SIZE >= totalCount} onClick={() => gotoPage(page + 1)}>
                        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                    </Button>
                </div>
            )}

            <ConfirmUndoSaleDialog
                open={!!undoSaleTarget}
                onOpenChange={(open) => {
                    if (!open) setUndoSaleTarget(null);
                }}
                transaction={undoSaleTarget}
            />
            <ConfirmUndoItemDialog
                open={!!undoItemTarget}
                onOpenChange={(open) => {
                    if (!open) setUndoItemTarget(null);
                }}
                item={undoItemTarget}
            />
        </div>
    );
}
