"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// FIXME: now, for logout we need to call an api to invalidate the refresh token on server side
// but for now, we just delete the cookies on client side
export async function logoutAction() {
  (await cookies()).delete("session-token");
  (await cookies()).delete("refresh-token");

  revalidatePath("/"); // Opsional: bersihkan cache jika perlu
  redirect("/auth?message=logout-success");
}
