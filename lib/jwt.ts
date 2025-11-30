import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export const verifyJwt = async (token: string) => {
  return await jwtVerify(token, getJwtSecretKey());
};

export const signJwt = async (
  payload: JWTPayload,
  expiresIn?: string | number
) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn || "30d") // Atur expired
    .sign(getJwtSecretKey());
};
