"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { createClient } from "@/lib/supabase/client";
import { SellerProfile } from "./[id]/seller-profile";
import { CreateSellerDialog } from "./create-seller-dialog";
import type { SellerRow, TextbookItemRow } from "./inventory-utils";
import { SellersList } from "./sellers-list";

interface SellersViewProps {
    sellers: SellerRow[];
    seller: SellerRow | null;
    items: TextbookItemRow[];
    eventId: string | null;
}

export function SellersView({ sellers, seller, items, eventId }: SellersViewProps) {
    const router = useRouter();
    const isMobile = useIsMobile(1024);
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("sellers-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "sellers", filter: `event_id=eq.${eventId}` }, () => router.refresh())
            .on("postgres_changes", { event: "*", schema: "public", table: "textbook_items" }, () => router.refresh())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router, eventId]);

    if (isMobile) {
        if (seller) {
            return (
                <div className="w-full min-w-0">
                    <SellerProfile seller={seller} items={items} showBackButton />
                </div>
            );
        }
        return (
            <div className="w-full min-w-0">
                <SellersList sellers={sellers} onAddClick={() => setCreateOpen(true)} activeSellerId={null} />
                <CreateSellerDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={(id) => router.push(`/dashboard/inventory/${id}`)} />
            </div>
        );
    }

    return (
        <div className="-mb-4 flex h-[calc(100svh-3.5rem)] w-full min-w-0 gap-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100svh-3rem)]">
            <div className="min-h-0 min-w-60">
                <SellersList sellers={sellers} onAddClick={() => setCreateOpen(true)} activeSellerId={seller?.id ?? null} className="pb-4" />
            </div>
            <Separator orientation="vertical" className="h-full" />
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-4">{seller ? <SellerProfile seller={seller} items={items} /> : <EmptyState />}</div>
            <CreateSellerDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={(id) => router.push(`/dashboard/inventory/${id}`)} />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Wybierz sprzedawcę z listy</p>
        </div>
    );
}
