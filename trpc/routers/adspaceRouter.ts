import { prisma } from '@/prisma/prisma';
import { mapAdspaceWithBusinessToDTO, mapAdspaceTypeToDTO } from '@/types/dtos';
import { protectedProcedure, publicProcedure, router } from '../init';
import z from 'zod';

export const adspaceRouter = router({
  list: publicProcedure.query(async () => {
    const adspaces = await prisma.adspace.findMany({
      include: {
        type: true,
        business: {
          include: {
            tags: true,
          },
        },
      },
    });

    return adspaces.map(mapAdspaceWithBusinessToDTO);
  }),
  types: publicProcedure.query(async () => {
    const types = await prisma.adspaceType.findMany();

    return types.map(mapAdspaceTypeToDTO);
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.string(),
        maxWidth: z.number(),
        maxHeight: z.number(),
        isBarterAvailable: z.boolean(),
        pricePerDay: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const adspace = await prisma.adspace.create({
        data: {
          name: input.name,
          description: input.description,
          type: {
            connect: {
              id: input.type,
            },
          },
          imageUrl: '', // TODO
          maxWidth: input.maxWidth,
          maxHeight: input.maxHeight,
          isBarterAvailable: input.isBarterAvailable,
          pricePerDay: input.pricePerDay,
          business: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      return adspace;
    }),
});
