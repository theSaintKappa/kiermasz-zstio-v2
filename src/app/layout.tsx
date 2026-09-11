import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { OnlineStatus } from "@/components/online-status";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import "./globals.css";

const outfitSans = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { template: `%s | ${SITE_NAME}`, default: SITE_NAME },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    keywords: ["kiermasz", "książki", "podręczniki", "ZSP", "ZSTiO", "Mechanik", "Tarnowskie Góry", "UCZĘSIĘWTG", "sprzedawaj", "kupuj", "taniej", "szybko", "lokalnie", "bez prowizji"],
    alternates: {
        canonical: "/",
        languages: {
            "pl-PL": "/",
        },
    },
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: "/",
        siteName: SITE_NAME,
        locale: SITE_LOCALE,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pl" className={cn("antialiased", outfitSans.variable, jetBrainsMono.variable)} suppressHydrationWarning>
            <body className="flex min-h-full flex-col">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <TooltipProvider>{children}</TooltipProvider>
                    <Toaster richColors position="bottom-center" />
                    <OnlineStatus />
                </ThemeProvider>
            </body>
        </html>
    );
}
