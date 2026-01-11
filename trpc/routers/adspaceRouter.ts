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
            owner: true,
          },
        },
      },
    });

    return adspaces.map(mapAdspaceWithBusinessToDTO);
  }),
  myList: protectedProcedure.query(async ({ ctx }) => {
    const adspaces = await prisma.adspace.findMany({
      where: {
        business: {
          ownerId: ctx.user.id,
        },
      },
      include: {
        type: true,
        business: {
          include: {
            tags: true,
            owner: true,
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const adspace = await prisma.adspace.findUnique({
        where: { id: input.id },
        include: {
          type: true,
          business: {
            include: {
              tags: true,
              owner: true,
            },
          },
        },
      });

      if (!adspace) {
        return null;
      }

      return mapAdspaceWithBusinessToDTO(adspace);
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
        pricePerWeek: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //if no business associated with user, throw error
      const userBusiness = await prisma.business.findFirst({
        where: {
          ownerId: ctx.user.id,
        },
      });

      if (!userBusiness) {
        throw new Error('User has no associated business');
      }

      const adspace = await prisma.adspace.create({
        data: {
          name: input.name,
          description: input.description,
          type: {
            connect: {
              id: input.type,
            },
          },
          imageUrl: 'https://placehold.co/96x128', // TODO
          maxWidth: input.maxWidth,
          maxHeight: input.maxHeight,
          isBarterAvailable: input.isBarterAvailable,
          pricePerWeek: input.pricePerWeek,
          business: {
            connect: {
              id: userBusiness.id
            }
          }
        },
      });

      return adspace;
    }),
});
