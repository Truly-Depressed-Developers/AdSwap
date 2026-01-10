import { AdspaceDTO } from './adspace';
import { TagDTO } from './tag';

type BusinessDTO = {
  id: string;
  name: string;
  description?: string;
  address: string;
  website?: string;
  nip: string;
  pkd: string;
  imageUrl?: string;
  tags: TagDTO[];
  coords: Coordinates;
};

type BuisinessWithAdspacesDTO = BusinessDTO & {
  adspaces: AdspaceDTO[];
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export type { BusinessDTO, BuisinessWithAdspacesDTO };
