import { Prisma } from '@prisma/client';
import { AdspaceDTO, mapAdspaceToDTO } from './adspace';
import { TagDTO, mapTagToDTO } from './tag';
import { mapUserToDTO, UserDTO } from './user';

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

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type BusinessData = Prisma.BusinessGetPayload<{
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
