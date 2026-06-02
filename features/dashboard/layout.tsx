import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/sidebar";
import type { CSSProperties, ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("spk.access-token")?.value;
  if (!token) {
    return redirect("/auth");
  }

  // Check user role from session cookie
  try {
    const sessionCookie = cookieStore.get("spk.session")?.value;
    if (!sessionCookie) {
      return redirect("/auth");
    }
    const session = JSON.parse(sessionCookie);
    if (!session.isAdmin) {
      return redirect("/"); // Redirect non-admins to the public landing page
    }
  } catch {
    return redirect("/auth");
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
