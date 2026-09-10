import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE_NAME } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
    title: "Logowanie",
    description: "Logowanie do panelu administracyjnego kiermaszu ZSP Mechanik.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "/login",
    },
    openGraph: {
        title: `Logowanie | ${SITE_NAME}`,
        url: "/login",
        siteName: SITE_NAME,
        locale: "pl_PL",
        type: "website",
    },
};

export default async function LoginPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect("/dashboard");

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </main>
    );
}
