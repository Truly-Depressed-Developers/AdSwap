import { BusinessDTO } from './business';

type AdspaceDTO = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  type: AdspaceTypeDTO;
  maxWidth: number;
  maxHeight: number;
  imageUrl: string;
  pricePerDay?: number;
  inUse: boolean;
  createdAt: Date;
};

type AdspacesWithBusinessDTO = AdspaceDTO & {
  business: BusinessDTO;
};

type AdspaceTypeDTO = {
  id: string;
  name: string;
  description?: string;
};

export type { AdspaceDTO, AdspacesWithBusinessDTO, AdspaceTypeDTO };
