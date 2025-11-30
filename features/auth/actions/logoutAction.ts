"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { logoutUser } from "../services/logoutUser";

export async function logoutAction() {
  await logoutUser();

  const cookieStore = await cookies();
  cookieStore.delete("session-token");
  cookieStore.delete("refresh-token");

  revalidatePath("/"); // Opsional: bersihkan cache jika perlu
  redirect("/auth?message=logout-success");
}
