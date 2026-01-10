import { prisma } from '@/prisma/prisma';
import { publicProcedure, router } from '../init';
import z from 'zod';
import bcrypt from 'bcryptjs';

export const userRouter = router({
  register: publicProcedure
    .input(
      z
        .object({
          firstName: z.string().min(1, 'Imię jest wymagane'),
          lastName: z.string().min(1, 'Nazwisko jest wymagane'),
          email: z.email('Wpisz prawidłowy adres email'),
          password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Hasła nie pasują do siebie',
          path: ['confirmPassword'],
        }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error('Użytkownik z tym adresem email już istnieje');
      }

      const hashed = await bcrypt.hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: hashed,
        },
      });

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    }),
});
