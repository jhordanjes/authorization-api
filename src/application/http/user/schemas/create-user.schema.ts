import { UserRole } from 'generated/prisma';
import { z } from 'zod';

export const createAccountBodySchema = z.object({
  name: z.string(),
  password: z
    .string()
    .min(8)
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one symbol',
    }),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;
