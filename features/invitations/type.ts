export interface InvitationToken {
  id: string;
  token: string;
  email?: string | null;
  role: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

export interface CreateInvitationDTO {
  email?: string;
  role?: "user" | "admin";
  expiresInDays?: number;
}
