import { NextResponse } from "next/server";

import axios from "axios";

import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const { data: user } = await getCurrentUser();

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Terjadi kesalahan server.",
        },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.delete("spk.access-token");
    cookieStore.delete("spk.refresh-token");

    return NextResponse.json({
      message: "Sesi tidak valid atau telah kedaluwarsa",
      status: 401,
    });
  }
}
