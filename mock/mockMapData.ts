import type { AdspacesWithBusinessDTO, AdspaceTypeDTO } from '@/types/dtos/adspace';

// Mock adspace types
export const mockAdspaceTypes: AdspaceTypeDTO[] = [
  { id: '1', name: 'Billboard', description: 'Large outdoor billboard' },
  { id: '2', name: 'Witryna', description: 'Shop window display' },
  { id: '3', name: 'Baner', description: 'Banner advertisement' },
  { id: '4', name: 'Plakat', description: 'Poster space' },
];

// Mock data for adspaces in Krakow
export const mockAdspaces: AdspacesWithBusinessDTO[] = [
  {
    id: '1',
    businessId: 'b1',
    name: 'Billboard Rynek',
    description: 'Duży billboard w centrum Krakowa',
    type: mockAdspaceTypes[0],
    maxWidth: 600,
    maxHeight: 300,
    imageUrl: 'https://placehold.co/600x300',
    pricePerWeek: 500,
    inUse: false,
    createdAt: new Date(),
    isBarterAvailable: true,
    business: {
      id: 'b1',
      name: 'Reklamy Kraków Sp. z o.o.',
      description: 'Agencja reklamowa',
      address: 'Rynek Główny 1, 31-042 Kraków',
      nip: '1234567890',
      pkd: '73.11.Z',
      imageUrl: 'https://placehold.co/200x200',
      tags: [],
      coords: { latitude: 50.0619, longitude: 19.9372 },
    },
  },
  {
    id: '2',
    businessId: 'b2',
    name: 'Witryna Kazimierz',
    description: 'Przestrzeń reklamowa w witrynie sklepu',
    type: mockAdspaceTypes[1],
    maxWidth: 200,
    maxHeight: 150,
    imageUrl: 'https://placehold.co/200x150',
    pricePerWeek: 150,
    isBarterAvailable: false,
    inUse: true,
    createdAt: new Date(),
    business: {
      id: 'b2',
      name: 'Sklep Kazimierz',
      description: 'Sklep wielobranżowy',
      address: 'ul. Szeroka 15, 31-053 Kraków',
      nip: '9876543210',
      pkd: '47.19.Z',
      imageUrl: 'https://placehold.co/200x200',
      tags: [],
      coords: { latitude: 50.0515, longitude: 19.9465 },
    },
  },
  {
    id: '3',
    businessId: 'b3',
    name: 'Baner Nowa Huta',
    description: 'Baner reklamowy przy głównej ulicy',
    type: mockAdspaceTypes[2],
    maxWidth: 400,
    maxHeight: 100,
    imageUrl: 'https://placehold.co/400x100',
    isBarterAvailable: true,
    inUse: false,
    createdAt: new Date(),
    business: {
      id: 'b3',
      name: 'Marketing Nowa Huta',
      description: 'Lokalna agencja marketingowa',
      address: 'os. Centrum A 1, 31-929 Kraków',
      nip: '5551234567',
      pkd: '73.11.Z',
      imageUrl: 'https://placehold.co/200x200',
      tags: [],
      coords: { latitude: 50.0726, longitude: 20.0373 },
    },
  },
  {
    id: '4',
    businessId: 'b4',
    name: 'Plakat Podgórze',
    description: 'Miejsce na plakat w popularnej lokalizacji',
    type: mockAdspaceTypes[3],
    maxWidth: 100,
    maxHeight: 140,
    isBarterAvailable: false,
    imageUrl: 'https://placehold.co/100x140',
    pricePerWeek: 50,
    inUse: false,
    createdAt: new Date(),
    business: {
      id: 'b4',
      name: 'Galeria Podgórze',
      description: 'Galeria sztuki',
      address: 'ul. Limanowskiego 24, 30-551 Kraków',
      nip: '1112223334',
      pkd: '90.04.Z',
      tags: [],
      coords: { latitude: 50.0435, longitude: 19.9512 },
    },
  },
  {
    id: '5',
    businessId: 'b5',
    name: 'Billboard Bronowice',
    description: 'Billboard przy centrum handlowym',
    type: mockAdspaceTypes[0],
    maxWidth: 800,
    maxHeight: 400,
    imageUrl: 'https://placehold.co/800x400',
    isBarterAvailable: true,
    inUse: true,
    createdAt: new Date(),
    business: {
      id: 'b5',
      name: 'MediaMax',
      description: 'Sieć reklam zewnętrznych',
      address: 'ul. Armii Krajowej 11, 30-150 Kraków',
      nip: '9998887776',
      pkd: '73.12.A',
      tags: [],
      coords: { latitude: 50.0789, longitude: 19.8912 },
    },
  },
];

export function filterAdspaces(
  adspaces: AdspacesWithBusinessDTO[],
  filters: { search: string; typeId: string | null; availability: 'all' | 'available' | 'in_use' }
) {
  return adspaces.filter((adspace) => {
    // Search filter - matches business name or adspace name
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = adspace.name.toLowerCase().includes(searchLower);
      const matchesBusiness = adspace.business.name.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesBusiness) {
        return false;
      }
    }
    if (filters.typeId && adspace.type.id !== filters.typeId) {
      return false;
    }
    if (filters.availability === 'available' && adspace.inUse) {
      return false;
    }
    if (filters.availability === 'in_use' && !adspace.inUse) {
      return false;
    }
    return true;
  });
}
