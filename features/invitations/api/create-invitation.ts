"use server";

import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";
import type { CreateInvitationDTO, InvitationToken } from "../type";

export const createInvitation = async (
  payload: CreateInvitationDTO
): Promise<InvitationToken> => {
  const response = await backendClient.post<SuccessResponse<InvitationToken>>(
    "/invitations",
    payload
  );
  return response.data.data;
};
