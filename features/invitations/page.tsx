import { SiteHeader } from "@/features/dashboard/components/header";
import { getInvitations } from "./api/get-invitations";
import { InvitationSection } from "./components/InvitationSection";

export const dynamic = "force-dynamic";

export default async function InvitationsPage() {
  const invitations = await getInvitations();
  const serverTime = new Date().toISOString();

  return (
    <div>
      <SiteHeader page="Invitations" />
      <main className="container mx-auto max-w-7xl p-4">
        <InvitationSection
          initialData={invitations}
          serverTime={serverTime}
        />
      </main>
    </div>
  );
}
