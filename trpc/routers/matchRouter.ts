import { prisma } from '@/prisma/prisma';
import { protectedProcedure, router } from '../init';
import { z } from 'zod';

export const matchRouter = router({
  getNextCard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get already swiped business IDs
    const swipedBusinessIds = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { targetBusinessId: true },
    });
    const swipedIds = swipedBusinessIds.map((s) => s.targetBusinessId);

    // Get own business IDs to exclude
    const ownBusinesses = await prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const ownIds = ownBusinesses.map((b) => b.id);

    // Find random business with at least one adspace, excluding already swiped and own
    const businesses = await prisma.business.findMany({
      where: {
        id: { notIn: [...swipedIds, ...ownIds] },
        adspaces: { some: {} },
      },
      include: {
        tags: true,
        adspaces: { include: { type: true } },
      },
      take: 10,
    });

    if (businesses.length === 0) {
      return null;
    }

    // Pick a random one
    const randomIndex = Math.floor(Math.random() * businesses.length);
    return businesses[randomIndex];
  }),

  swipe: protectedProcedure
    .input(
      z.object({
        targetBusinessId: z.string(),
        direction: z.enum(['left', 'right']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Record the swipe
      await prisma.swipe.create({
        data: {
          swiperId: userId,
          targetBusinessId: input.targetBusinessId,
          direction: input.direction,
        },
      });

      // If right swipe -> instant match (PoC simplification)
      if (input.direction === 'right') {
        const targetBusiness = await prisma.business.findUnique({
          where: { id: input.targetBusinessId },
          include: { adspaces: true },
        });

        if (targetBusiness) {
          // Create chat between the two users
          const chat = await prisma.chat.create({
            data: {
              participants: {
                connect: [{ id: userId }, { id: targetBusiness.ownerId }],
              },
              adspaces: targetBusiness.adspaces[0]
                ? { connect: { id: targetBusiness.adspaces[0].id } }
                : undefined,
            },
          });

          return {
            matched: true,
            chatId: chat.id,
            matchedBusinessName: targetBusiness.name,
          };
        }
      }

      return { matched: false, chatId: null, matchedBusinessName: null };
    }),
});
