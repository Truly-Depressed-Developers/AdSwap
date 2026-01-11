import { Prisma } from '@prisma/client';
import { UserDTO, mapUserToDTO } from './user';

export type RatingDTO = {
  id: string;
  businessId: string;
  userId: string;
  score: number;
  comment?: string;
  createdAt: Date;
  user: UserDTO;
};

export type RatingData = Prisma.RatingGetPayload<{
  include: {
    user: true;
  };
}>;

export const mapRatingToDTO = (rating: RatingData): RatingDTO => ({
  id: rating.id,
  businessId: rating.businessId,
  userId: rating.userId,
  score: rating.score,
  comment: rating.comment ?? undefined,
  createdAt: rating.createdAt,
  user: mapUserToDTO(rating.user),
});
