import { prisma } from '@/prisma/prisma';
import { mapBusinessWithAdspacesToDTO } from '@/types/dtos';
import { publicProcedure, router } from '../init';

export const businessRouter = router({
  list: publicProcedure.query(async () => {
    const businesses = await prisma.business.findMany({
      include: {
        tags: true,
        adspaces: {
          include: {
            type: true,
          },
        },
        owner: true,
      },
    });

    return businesses.map(mapBusinessWithAdspacesToDTO);
  }),
});
