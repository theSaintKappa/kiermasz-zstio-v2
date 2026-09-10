import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CatalogView } from "./catalog-view";
import { resolveKiermaszState } from "./kiermasz-state";
import type { PublicCatalogRow } from "./public-catalog-utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Katalog | Kiermasz ZSP" };

function Header() {
    return (
        <header className="border-b">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Image src="/logo.svg" alt="Logo" width={120} height={28} className="h-9 w-auto dark:invert" />
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button nativeButton={false} render={<Link href="/login" />}>
                        Zaloguj się
                    </Button>
                </div>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="mt-auto border-t py-6 text-center text-muted-foreground text-sm">
            <Link href="/terms" className="underline-offset-4 hover:underline">
                Regulamin
            </Link>
            <span className="mx-2">·</span>
            Stworzone z ❤️ przez{" "}
            <Link href="https://github.com/theSaintKappa" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                Wojtka Zrałka
            </Link>
        </footer>
    );
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const initialQuery = q?.trim() ?? "";

    const state = await resolveKiermaszState();

    if (state.kind === "selling") {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("search_public_catalog", { p_query: initialQuery });

        if (error) console.error("Public catalog fetch error:", error.message);

        const rows: PublicCatalogRow[] = (data as PublicCatalogRow[]) ?? [];

        return (
            <main className="flex min-h-svh w-full flex-col">
                <Header />
                <div className="mx-auto w-full max-w-7xl">
                    <CatalogView initialRows={rows} initialQuery={initialQuery} />
                </div>
                <Footer />
            </main>
        );
    }

    // Message state (non-selling)
    return (
        <main className="flex min-h-svh w-full flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
                    <HugeiconsIcon icon={Calendar02Icon} className="size-10 text-muted-foreground" />
                    <h1 className="font-bold font-heading text-2xl">{state.title}</h1>
                    {state.body && <p className="text-muted-foreground">{state.body}</p>}
                </div>
            </div>
            <Footer />
        </main>
    );
}
