import { z } from 'zod';

export const authenticateBodySchema = z.object({
  password: z.string(),
  email: z.string().email(),
});

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
