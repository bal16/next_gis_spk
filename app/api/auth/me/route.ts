import { NextResponse } from "next/server";

import axios from "axios";

import { getCurrentUser } from "@/features/auth/services/getCurrentUser";

export async function GET() {
  try {
    const { data: user } = await getCurrentUser();

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Terjadi kesalahan server.",
      };
    }

    cookieStore.delete("session-token");

    return NextResponse.json(
      { message: "Sesi tidak valid atau telah kedaluwarsa" },
      { status: 401 }
    );
  }
}
