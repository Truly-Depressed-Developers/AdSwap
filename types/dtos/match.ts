import { Business, Tag } from '@prisma/client';
import { mapTagToDTO, TagDTO } from './tag';
import { AdspaceDTO, AdspaceWithType, mapAdspaceToDTO } from './adspace';

export type SwipeCardBusinessDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl?: string;
  logoUrl?: string;
  tags: TagDTO[];
  adspaces: AdspaceDTO[];
};

type SwipeCardBusiness = Business & {
  tags: Tag[];
  adspaces: AdspaceWithType[];
};

export const mapSwipeCardBusinessToDTO = (business: SwipeCardBusiness): SwipeCardBusinessDTO => ({
  id: business.id,
  name: business.name,
  description: business.description,
  address: business.address,
  imageUrl: business.imageUrl ?? undefined,
  logoUrl: business.logoUrl ?? undefined,
  tags: business.tags.map(mapTagToDTO),
  adspaces: business.adspaces.map(mapAdspaceToDTO),
});
