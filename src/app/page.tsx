import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogSection } from "./catalog-section";
import { CatalogShell } from "./catalog-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Katalog | Kiermasz ZSP" };

function Header() {
    return (
        <header className="border-b">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Image src="/logo.svg" alt="Logo" width={169} height={36} className="h-9 w-auto dark:invert" />
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

export function CatalogSkeleton() {
    return (
        <div className="flex w-full flex-col pt-4">
            <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
                {Array.from({ length: 12 }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: what else am I supposed to use
                    <div key={`sk-${i}`}>
                        <Skeleton className="aspect-210/297 w-full rounded-xl" />
                        <div className="space-y-2 p-2">
                            <Skeleton className="h-4.25 w-3/4" />
                            <div className="space-y-1">
                                <Skeleton className="h-[12.5px] w-full" />
                                <Skeleton className="h-[12.5px] w-1/5" />
                            </div>
                            <Skeleton className="h-4.25 w-1/5 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const initialQuery = q?.trim() ?? "";

    return (
        <main className="flex min-h-svh w-full flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl">
                <CatalogShell initialQuery={initialQuery}>
                    <Suspense fallback={<CatalogSkeleton />}>
                        <CatalogSection initialQuery={initialQuery} />
                    </Suspense>
                    {/* <CatalogSkeleton />
                    <CatalogSection initialQuery={initialQuery} /> */}
                </CatalogShell>
            </div>
            <Footer />
        </main>
    );
}
