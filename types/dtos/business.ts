import { Prisma } from '@prisma/client';
import { AdspaceDTO, mapAdspaceToDTO } from './adspace';
import { TagDTO, mapTagToDTO } from './tag';
import { mapUserToDTO, UserDTO } from './user';
import { RatingDTO, mapRatingToDTO } from './rating';

export type BusinessDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  website?: string;
  nip: string;
  pkd: string;
  imageUrl?: string;
  logoUrl?: string;
  targetAudience: string;
  tags: TagDTO[];
  coords: Coordinates;
  owner: UserDTO;
};

export type BuisinessWithAdspacesDTO = BusinessDTO & {
  adspaces: AdspaceDTO[];
};

export type AdspaceCardDTO = {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  pricePerWeek?: number;
  isBarterAvailable: boolean;
  inUse: boolean;
};

export type BusinessDetailDTO = BusinessDTO & {
  adspaces: AdspaceCardDTO[];
  ratings: RatingDTO[];
  averageRating?: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type BusinessData = Prisma.BusinessGetPayload<{
  include: {
    tags: true;
    owner: true;
  };
}>;

type BusinessDataWithAdspaces = Prisma.BusinessGetPayload<{
  include: {
    tags: true;
    owner: true;
    adspaces: { include: { type: true } };
  };
}>;

type BusinessDataWithDetails = Prisma.BusinessGetPayload<{
  include: {
    tags: true;
    owner: true;
    adspaces: { include: { type: true } };
    ratings: { include: { user: true } };
  };
}>;

export const mapBusinessToDTO = (business: BusinessData): BusinessDTO => ({
  id: business.id,
  name: business.name,
  description: business.description,
  address: business.address,
  website: business.website ?? undefined,
  nip: business.nip,
  pkd: business.pkd,
  imageUrl: business.imageUrl ?? undefined,
  logoUrl: business.logoUrl ?? undefined,
  targetAudience: business.targetAudience,
  tags: business.tags.map(mapTagToDTO),
  coords: {
    latitude: business.latitude,
    longitude: business.longitude,
  },
  owner: mapUserToDTO(business.owner),
});

export const mapBusinessWithAdspacesToDTO = (
  business: BusinessDataWithAdspaces,
): BuisinessWithAdspacesDTO => ({
  ...mapBusinessToDTO(business),
  adspaces: business.adspaces.map(mapAdspaceToDTO),
});

export const mapAdspaceToCardDTO = (
  adspace: Prisma.AdspaceGetPayload<{ include: { type: true } }>,
): AdspaceCardDTO => ({
  id: adspace.id,
  name: adspace.name,
  imageUrl: adspace.imageUrl,
  type: adspace.type.name,
  pricePerWeek: adspace.pricePerWeek ?? undefined,
  isBarterAvailable: adspace.isBarterAvailable,
  inUse: adspace.inUse,
});

export const mapBusinessToDetailDTO = (business: BusinessDataWithDetails): BusinessDetailDTO => {
  const ratings = business.ratings.map(mapRatingToDTO);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
      : undefined;

  return {
    ...mapBusinessToDTO(business),
    adspaces: business.adspaces.map(mapAdspaceToCardDTO),
    ratings,
    averageRating,
  };
};
