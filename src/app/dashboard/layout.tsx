import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CartBubble } from "./cart/cart-bubble";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { EventGuard } from "./event-guard";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset className="min-w-0">
                <DashboardHeader />
                <main className="flex min-w-0 flex-1 p-4 pt-0">
                    <EventGuard>{children}</EventGuard>
                </main>
            </SidebarInset>
            <CartBubble />
        </SidebarProvider>
    );
}
