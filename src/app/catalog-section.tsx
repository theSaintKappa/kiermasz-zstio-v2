import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createClient } from "@/lib/supabase/server";
import { CatalogResults } from "./catalog-results";
import { resolveKiermaszState } from "./kiermasz-state";
import type { PublicCatalogRow } from "./public-catalog-utils";

interface CatalogSectionProps {
    initialQuery: string;
}

export async function CatalogSection({ initialQuery }: CatalogSectionProps) {
    const state = await resolveKiermaszState();

    if (state.kind === "selling") {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("search_public_catalog", { p_query: initialQuery });

        if (error) console.error("Public catalog fetch error:", error.message);

        const rows: PublicCatalogRow[] = (data as PublicCatalogRow[]) ?? [];
        return <CatalogResults initialRows={rows} initialQuery={initialQuery} />;
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
                <HugeiconsIcon icon={Calendar02Icon} className="size-10 text-muted-foreground" />
                <h1 className="font-bold font-heading text-2xl">{state.title}</h1>
                {state.body && <p className="text-muted-foreground">{state.body}</p>}
            </div>
        </div>
    );
}
