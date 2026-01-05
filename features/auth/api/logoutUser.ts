import "server-only";

// import backendClient from '@/lib/api/server';

export const logoutUser = async () => {
  // backendClient.post<LogoutResponse>(`/auth/logout`, {}, {useToken: false});
  // console.log("Mock login with:", credentials);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
