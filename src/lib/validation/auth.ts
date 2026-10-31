import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const resetRequestSchema = z.object({
  email: z.string().email(),
});

export const resetConfirmSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(128),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  locale: z.enum(["en", "bn"]).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});
