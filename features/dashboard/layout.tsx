import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/sidebar";
import type { CSSProperties, ReactNode } from "react";
import { redirect } from "next/navigation";
import axios from "axios";

import backendClient from "@/lib/api/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const response = await backendClient.get("/auth/me", {
      headers: { "Cache-Control": "no-store" },
    } as never);

    const payload = response.data as { data?: { isAdmin?: boolean; role?: string }; isAdmin?: boolean; role?: string };
    const user = (payload?.data ?? payload) as { isAdmin?: boolean; role?: string } | undefined;
    const isAdmin = Boolean(user?.isAdmin ?? (user?.role === "admin"));

    if (!isAdmin) {
      redirect("/auth?reason=forbidden");
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error("[AdminLayout] auth check failed:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        redirect("/auth?next=/admin&reason=unauthenticated");
      }
      if (status === 403) {
        redirect("/auth?reason=forbidden");
      }
      if (status && status >= 500) {
        redirect("/auth?reason=unavailable");
      }
      if (!error.response) {
        redirect("/auth?reason=unavailable");
      }
      redirect("/auth?reason=unavailable");
    }

    redirect("/auth?next=/admin&reason=unauthenticated");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
