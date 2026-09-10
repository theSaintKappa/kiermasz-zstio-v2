import { ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format-utils";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { resolveCurrentTerms } from "@/lib/terms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Regulamin",
    description: "Regulamin korzystania z kiermaszu ZSP Mechanik.",
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: `Regulamin | ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
        url: "/terms",
        siteName: SITE_NAME,
        locale: "pl_PL",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `Regulamin | ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
    },
};

export default async function TermsPage() {
    const terms = await resolveCurrentTerms();

    return (
        <main className="mx-auto min-h-svh w-full max-w-3xl p-6 md:p-10">
            <div className="flex flex-col gap-4">
                <Image src="/logo.svg" alt={`${SITE_NAME} — logo`} width={169} height={36} className="h-18 w-auto dark:invert" />
                <Button variant="link" className="w-fit p-0" render={<Link href="/" />} nativeButton={false}>
                    <HugeiconsIcon icon={ArrowLeftIcon} />
                    Powrót do strony głównej
                </Button>
                <h1 className="font-bold font-heading text-3xl">Regulamin</h1>
                {terms ? (
                    <>
                        <p className="text-muted-foreground text-sm">Ostatnia aktualizacja: {formatDateTime(terms.updatedAt)}</p>
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{terms.content}</ReactMarkdown>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground text-sm">Regulamin nie jest jeszcze dostępny.</p>
                )}
            </div>
        </main>
    );
}
