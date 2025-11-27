import 'server-only'

import { type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecretKey } from '@/lib/utils';
import type { JWTPayload } from 'jose';

export interface UserSession {
  isAuthenticated: boolean;
  isAdmin: boolean;
  payload: JWTPayload | null;
  error?: 'invalid_token'; 
}

/**
 * @name getUserSession
 * "Data Access Layer" (DAL)
 * Fungsinya hanya satu: mendapatkan data sesi pengguna dari request.
 * Middleware akan MEMANGGIL fungsi ini, bukan melakukan logikanya sendiri.
 */
export async function getUserSession(
  request: NextRequest,
): Promise<UserSession> {
  const token = request.cookies.get('session-token')?.value;

  if (!token) {
    return { isAuthenticated: false, isAdmin: false, payload: null };
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    const isAdmin = payload.role === "admin"; 

    return { isAuthenticated: true, isAdmin, payload };
  } catch (err) {
    console.error('JWT Verification Error (in session.ts):', (err as Error).message);
    return { isAuthenticated: false, isAdmin: false, payload: null, error: 'invalid_token' };
  }
}