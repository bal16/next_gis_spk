import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import axios from "axios";

import { getCurrentUser } from "@/features/auth/services/getCurrentUser";

export async function GET() {
  const token = (await cookies()).get("session-token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const { data } = await getCurrentUser(token);

    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Terjadi kesalahan server.",
      };
    }

    (await cookies()).delete("session-token");
    return NextResponse.json(
      { message: "Sesi tidak valid atau telah kedaluwarsa" },
      { status: 401 }
    );
  }
}
