import { UserRole } from 'generated/prisma';
import { z } from 'zod';

export const updateAccountBodySchema = z.object({
  name: z.string(),
  password: z
    .string()
    .min(8)
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one symbol',
    })
    .optional()
    .or(z.literal(undefined)),

  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional(),
});

export type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>;
