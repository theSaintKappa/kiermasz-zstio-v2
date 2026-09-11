"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function requireAuth() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Nie jesteś zalogowany.");
    return supabase;
}

async function getEventId(): Promise<string> {
    const cookieStore = await cookies();
    const eventId = cookieStore.get("x-event-id")?.value;
    if (!eventId) throw new Error("Nie wybrano wydarzenia.");
    return eventId;
}

interface SaleConflict {
    itemId: string;
    reason: string;
}

interface CompleteSaleResult {
    sold: string[];
    conflicts: SaleConflict[];
}

export async function completeSale(itemIds: string[]): Promise<CompleteSaleResult> {
    if (itemIds.length === 0) throw new Error("Koszyk jest pusty.");

    const supabase = await requireAuth();
    const eventId = await getEventId();

    const { data, error } = await supabase.rpc("complete_sale", {
        p_event_id: eventId,
        p_item_ids: itemIds,
    });

    if (error) throw new Error(error.message);

    const result = data as CompleteSaleResult;
    return result;
}

interface ReservationResult {
    reservationId: string | null;
    reservationNumber: string | null;
    conflicts: SaleConflict[];
}

export async function createReservation(itemIds: string[], firstName: string, lastName: string, expiresOn: string): Promise<ReservationResult> {
    if (itemIds.length === 0) throw new Error("Koszyk jest pusty.");
    if (!firstName.trim()) throw new Error("Podaj imię.");
    if (!lastName.trim()) throw new Error("Podaj nazwisko.");

    const supabase = await requireAuth();
    const eventId = await getEventId();

    const { data, error } = await supabase.rpc("create_reservation_from_cart", {
        p_event_id: eventId,
        p_item_ids: itemIds,
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_expires_on: expiresOn,
    });

    if (error) throw new Error(error.message);

    return data as ReservationResult;
}

export async function undoSale(saleId: string): Promise<void> {
    const supabase = await requireAuth();
    const eventId = await getEventId();
    const { data, error } = await supabase.rpc("undo_sale", { p_event_id: eventId, p_sale_id: saleId });
    if (error) throw new Error(error.message);
    const result = data as { success: boolean };
    if (!result?.success) throw new Error("Nie znaleziono transakcji.");
    revalidatePath("/dashboard/transactions");
}

export async function undoSaleItem(saleItemId: string): Promise<void> {
    const supabase = await requireAuth();
    const eventId = await getEventId();
    const { data, error } = await supabase.rpc("undo_sale_item", { p_event_id: eventId, p_sale_item_id: saleItemId });
    if (error) throw new Error(error.message);
    const result = data as { success: boolean };
    if (!result?.success) throw new Error("Nie znaleziono pozycji transakcji.");
    revalidatePath("/dashboard/transactions");
}

export async function verifyCartItems(itemIds: string[]): Promise<string[]> {
    if (itemIds.length === 0) return [];

    const supabase = await requireAuth();
    const eventId = await getEventId();

    const { data, error } = await supabase.from("textbook_items").select("id, status").in("id", itemIds).eq("event_id", eventId);

    if (error) throw new Error(error.message);

    const unavailable = (data ?? []).filter((r) => r.status !== "available").map((r) => r.id);

    // Items not found are also conflicts
    const foundIds = new Set((data ?? []).map((r) => r.id));
    const notFound = itemIds.filter((id) => !foundIds.has(id));

    return [...unavailable, ...notFound];
}
