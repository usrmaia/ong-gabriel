import { $ZodErrorTree } from "zod/v4/core";

export type Result<T> = {
  success: boolean;
  data?: T;
  error?: $ZodErrorTree<T>; // { errors: string[]; properties?: Record<string, { errors: string[] }> };
  code?: number;
};
