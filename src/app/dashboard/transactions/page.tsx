import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getPageTitle } from "../nav-config";
import { PAGE_SIZE, type TransactionItemRow, type TransactionRow } from "./transactions-utils";
import { TransactionsView } from "./transactions-view";

export const metadata: Metadata = {
    title: getPageTitle("transactions"),
};

const SALE_SELECT = `
    id, sold_at, reservation_id,
    items:sale_items(
        id, price,
        textbook_item:textbook_items(
            id,
            title:textbook_titles(title, subtitle, isbn, publisher, publishing_year, level, cover_path, subject:subjects(name)),
            seller:sellers(id, first_name, last_name, class_symbol)
        )
    )
`;

interface TransactionsPageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
}

interface SearchMatch {
    saleId: string;
    matchedItemIds: string[];
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const eventId = cookieStore.get("x-event-id")?.value ?? null;

    const params = await searchParams;
    const query = (params.q ?? "").trim();
    const page = Math.max(0, parseInt(params.page ?? "0", 10) || 0);

    if (!eventId) {
        return <TransactionsView transactions={[]} totalCount={0} page={0} query="" highlights={{}} dayCounts={{}} />;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Supabase nested select returns loosely typed rows
    const mapTransaction = (raw: any): TransactionRow => {
        // biome-ignore lint/suspicious/noExplicitAny: Supabase nested select returns loosely typed rows
        const items: TransactionItemRow[] = (raw.items ?? []).map((ri: any) => {
            const ti = ri.textbook_item;
            const tt = ti?.title;
            const seller = ti?.seller;
            return {
                saleItemId: ri.id,
                itemId: ti?.id ?? "",
                price: ri.price ?? 0,
                title: tt?.title ?? "",
                subtitle: tt?.subtitle ?? null,
                isbn: tt?.isbn ?? "",
                publisher: tt?.publisher ?? null,
                publishingYear: tt?.publishing_year ?? null,
                level: tt?.level ?? "basic",
                subjectName: tt?.subject?.name ?? null,
                coverPath: tt?.cover_path ?? null,
                sellerId: seller?.id ?? "",
                sellerFirstName: seller?.first_name ?? "",
                sellerLastName: seller?.last_name ?? "",
                classSymbol: seller?.class_symbol ?? "",
            };
        });
        return {
            id: raw.id,
            soldAt: raw.sold_at,
            reservationId: raw.reservation_id,
            items,
            total: items.reduce((sum, i) => sum + i.price, 0),
        };
    };

    if (query) {
        // Search mode
        const { data: matched } = await supabase.rpc("search_transactions", {
            p_event_id: eventId,
            p_query: query,
            p_limit: PAGE_SIZE,
        });
        const matches = (matched ?? []) as SearchMatch[];

        if (matches.length === 0) {
            return <TransactionsView transactions={[]} totalCount={0} page={0} query={query} highlights={{}} dayCounts={{}} />;
        }

        const saleIds = matches.map((m) => m.saleId);
        const { data: rawSales } = await supabase.from("sales").select(SALE_SELECT).in("id", saleIds);

        // Reorder to match RPC rank order
        const saleMap = new Map((rawSales ?? []).map((s) => [s.id, s]));
        const ordered = saleIds.map((id) => saleMap.get(id)).filter(Boolean);

        const transactions = ordered.map(mapTransaction);
        const highlights: Record<string, string[]> = {};
        for (const m of matches) {
            highlights[m.saleId] = m.matchedItemIds;
        }

        return <TransactionsView transactions={transactions} totalCount={matches.length} page={0} query={query} highlights={highlights} dayCounts={{}} />;
    }

    // List mode — paginated
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const [{ data: rawSales }, { count }, { data: dayCountsRaw }] = await Promise.all([
        supabase.from("sales").select(SALE_SELECT).eq("event_id", eventId).order("sold_at", { ascending: false }).range(from, to),
        supabase.from("sales").select("id", { count: "exact", head: true }).eq("event_id", eventId),
        supabase.rpc("count_sales_by_day", { p_event_id: eventId }),
    ]);

    const dayCounts = (dayCountsRaw ?? {}) as Record<string, number>;

    // Clamp page if stale
    const total = count ?? 0;
    if (page > 0 && from >= total) {
        const clampedPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
        const clampedFrom = clampedPage * PAGE_SIZE;
        const clampedTo = clampedFrom + PAGE_SIZE - 1;
        const { data: clampedSales } = await supabase.from("sales").select(SALE_SELECT).eq("event_id", eventId).order("sold_at", { ascending: false }).range(clampedFrom, clampedTo);
        const transactions = (clampedSales ?? []).map(mapTransaction);
        return <TransactionsView transactions={transactions} totalCount={total} page={clampedPage} query="" highlights={{}} dayCounts={dayCounts} />;
    }

    const transactions = (rawSales ?? []).map(mapTransaction);
    return <TransactionsView transactions={transactions} totalCount={total} page={page} query="" highlights={{}} dayCounts={dayCounts} />;
}
