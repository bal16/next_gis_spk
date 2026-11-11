"use server";

import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";
import type { InvitationToken } from "../type";

export const getInvitations = async (): Promise<InvitationToken[]> => {
  try {
    const response = await backendClient.get<
      SuccessResponse<InvitationToken[]>
    >("/invitations");
    return response.data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[getInvitations] Note: backend invitations endpoint may still be pending", error);
    }
    return [];
  }
};
