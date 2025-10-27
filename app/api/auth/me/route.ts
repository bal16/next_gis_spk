import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getCurrentUser } from '@/lib/services/auth';



export async function GET() {
  const token = (await cookies()).get('session-token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Tidak terautentikasi' }, 
      { status: 401 }
    );
  }

  try {
    // 2. Teruskan token ke API Backend Eksternal Anda
    const { data } = await getCurrentUser(token)

    // 3. Kembalikan data pengguna yang aman (tanpa token) ke client
    return NextResponse.json(data.data);

  } catch (error) {
    // Jika token tidak valid, API eksternal mungkin mengembalikan 401
     console.error(error);
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Terjadi kesalahan server.",
      };
    }
    // Hapus cookie yang tidak valid
    (await
        // Jika token tidak valid, API eksternal mungkin mengembalikan 401
          // Hapus cookie yang tidak valid
          cookies()).delete('session-token');
    return NextResponse.json(
      { message: 'Sesi tidak valid atau telah kedaluwarsa' }, 
      { status: 401 }
    );
  }
}