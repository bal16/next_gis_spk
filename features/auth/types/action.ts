export type ActionResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
