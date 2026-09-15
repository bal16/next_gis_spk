import { NextResponse } from "next/server";

import axios from "axios";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

export async function GET() {
  try {
    const result = await getCurrentUser();

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("[GET /api/auth/me] error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const backendData = error.response?.data;

      if (status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete("spk.access-token");
        cookieStore.delete("spk.refresh-token");
        return NextResponse.json(
          {
            message: "Sesi tidak valid atau telah kedaluwarsa",
            status: 401,
            error: backendData,
          },
          { status: 401, headers: { "Cache-Control": "no-store" } }
        );
      }

      if (status === 403) {
        return NextResponse.json(
          { status: "error", message: "Forbidden: bukan admin" },
          { status: 403, headers: { "Cache-Control": "no-store" } }
        );
      }

      if (status && status >= 500) {
        return NextResponse.json(
          { status: "error", message: "Terjadi kesalahan server." },
          { status: 500, headers: { "Cache-Control": "no-store" } }
        );
      }

      if (!error.response) {
        return NextResponse.json(
          { status: "error", message: "Backend tidak tersedia atau timeout" },
          { status: 504, headers: { "Cache-Control": "no-store" } }
        );
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete("spk.access-token");
    cookieStore.delete("spk.refresh-token");

    return NextResponse.json(
      { message: "Sesi tidak valid atau telah kedaluwarsa", status: 401 },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
}
