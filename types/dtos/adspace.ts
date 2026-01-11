import { AdspaceType, Prisma } from '@prisma/client';
import type { BusinessDTO } from './business';
import { mapBusinessToDTO } from './business';

export type AdspaceDTO = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  type: AdspaceTypeDTO;
  maxWidth: number;
  maxHeight: number;
  imageUrl: string;
  isBarterAvailable: boolean;
  pricePerWeek?: number;
  inUse: boolean;
  createdAt: Date;
};

export type AdspacesWithBusinessDTO = AdspaceDTO & {
  business: BusinessDTO;
};

export type AdspaceTypeDTO = {
  id: string;
  name: string;
  description?: string;
};

export type AdspaceWithType = Prisma.AdspaceGetPayload<{
  include: { type: true };
}>;

type AdspaceWithTypeAndBusiness = Prisma.AdspaceGetPayload<{
  include: {
    type: true;
    business: {
      include: {
        tags: true;
        owner: true;
      };
    };
  };
}>;

export const mapAdspaceTypeToDTO = (type: AdspaceType): AdspaceTypeDTO => ({
  id: type.id,
  name: type.name,
  description: type.description ?? undefined,
});

export const mapAdspaceToDTO = (adspace: AdspaceWithType): AdspaceDTO => ({
  id: adspace.id,
  businessId: adspace.businessId,
  name: adspace.name,
  description: adspace.description ?? undefined,
  type: mapAdspaceTypeToDTO(adspace.type),
  maxWidth: adspace.maxWidth,
  maxHeight: adspace.maxHeight,
  imageUrl: adspace.imageUrl,
  isBarterAvailable: adspace.isBarterAvailable,
  pricePerWeek: adspace.pricePerWeek ?? undefined,
  inUse: adspace.inUse,
  createdAt: adspace.createdAt,
});

export const mapAdspaceWithBusinessToDTO = (
  adspace: AdspaceWithTypeAndBusiness,
): AdspacesWithBusinessDTO => {
  return {
    ...mapAdspaceToDTO(adspace),
    business: mapBusinessToDTO(adspace.business),
  };
};
