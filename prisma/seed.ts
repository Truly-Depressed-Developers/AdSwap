import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  plainPassword: string,
) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstName,
      lastName,
      password: hashed,
    },
  });
  return user;
}

async function createTags(names: string[]) {
  const tags = await Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  return tags;
}

async function createBusiness(
  name: string,
  description: string,
  address: string,
  nip: string,
  pkd: string,
  targetAudience: string,
  latitude: number,
  longitude: number,
  ownerId: string,
  tagIds: string[],
  logoUrl?: string
) {
  const business = await prisma.business.create({
    data: {
      name,
      description,
      address,
      nip,
      pkd,
      targetAudience,
      latitude,
      longitude,
      ownerId,
      logoUrl,
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
    },
  });
  return business;
}

async function createAdspaceType(name: string, description?: string) {
  const type = await prisma.adspaceType.upsert({
    where: { name },
    update: {},
    create: { name, description },
  });
  return type;
}

async function createAdspace(
  businessId: string,
  typeId: string,
  name: string,
  description: string,
  maxWidth: number,
  maxHeight: number,
  imageUrl: string,
  isBarterAvailable: boolean = false,
  pricePerWeek?: number,
) {
  const adspace = await prisma.adspace.create({
    data: {
      businessId,
      typeId,
      name,
      description,
      maxWidth,
      maxHeight,
      imageUrl,
      isBarterAvailable,
      pricePerWeek,
    },
  });
  return adspace;
}

async function createChat(userAId: string, userBId: string, adspaceIds: string[]) {
  const chat = await prisma.chat.create({
    data: {
      participants: {
        connect: [{ id: userAId }, { id: userBId }],
      },
      adspaces: {
        connect: adspaceIds.map((id) => ({ id })),
      },
    },
  });
  return chat;
}

async function createMessage(
  chatId: string,
  senderId: string,
  content: string,
  isRead: boolean = false,
) {
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
      isRead,
    },
  });
  return message;
}

async function main() {
  console.log('Seeding database...\n');

  // Create users
  const user1 = await createUser('jan@mail.com', 'Jan', 'Kowalski', 'password123');
  const user2 = await createUser('anna@mail.com', 'Anna', 'Nowak', 'password123');
  const user3 = await createUser('piotr@mail.com', 'Piotr', 'Wiśniewski', 'password123');
  const user4 = await createUser('maria@mail.com', 'Maria', 'Wójcik', 'password123');
  const user5 = await createUser('tomasz@mail.com', 'Tomasz', 'Kamiński', 'password123');
  const user6 = await createUser('kasia@mail.com', 'Katarzyna', 'Zielińska', 'password123');
  const user7 = await createUser('marek@mail.com', 'Marek', 'Szymański', 'password123');

  // Create tags
  const [tagKawiarnia, tagRestauracja, tagOutdoor, tagReklama, tagMarketing, tagSztuka, tagHandel] =
    await createTags([
      'Kawiarnia',
      'Restauracja',
      'Outdoor',
      'Reklama',
      'Marketing',
      'Sztuka',
      'Handel',
    ]);

  // Create 7 Krakow businesses
  const business1 = await createBusiness(
    'Matcha 24/7',
    'Urokliwe miejsce z wieloletnim doświadczeniem',
    'Rynek Główny 1, 31-042 Kraków',
    '1234567890',
    '73.11.Z',
    'Młodzi dorośli 18-30 lat',
    50.0619,
    19.9372,
    user1.id,
    [tagKawiarnia.id, tagRestauracja.id],
    '/logo_1.png'
  );

  const business2 = await createBusiness(
    'Green Leaf Cafe',
    'Kawiarnia',
    'ul. Szeroka 15, 31-053 Kraków',
    '9876543210',
    '47.19.Z',
    'Mieszkańcy i turyści 18-65 lat',
    50.0515,
    19.9465,
    user2.id,
    [tagKawiarnia.id],
    '/logo_2.png'
  );

  const business3 = await createBusiness(
    'Wild House',
    'Sklep oferujący rośliny do domu',
    'os. Centrum A 1, 31-929 Kraków',
    '5551234567',
    '56.10.A',
    'Dorośli 30-60 lat',
    50.0726,
    20.0373,
    user3.id,
    [tagHandel.id],
    '/logo_3.png'
  );

  const business4 = await createBusiness(
    'Galeria Podgórze',
    'Galeria sztuki współczesnej',
    'ul. Limanowskiego 24, 30-551 Kraków',
    '1112223334',
    '90.04.Z',
    'Miłośnicy sztuki i kolekcjonerzy 30-60 lat',
    50.0435,
    19.9512,
    user4.id,
    [tagSztuka.id],
  );

  const business5 = await createBusiness(
    'MediaMax',
    'Sieć reklam zewnętrznych',
    'ul. Armii Krajowej 11, 30-150 Kraków',
    '9998887776',
    '73.12.A',
    'Kierowcy i piesi 18-50 lat',
    50.0789,
    19.8912,
    user5.id,
    [tagReklama.id, tagOutdoor.id],
  );

  const business6 = await createBusiness(
    'Restauracja Stare Miasto',
    'Tradycyjna polska kuchnia w zabytkowych wnętrzach',
    'ul. Grodzka 35, 31-001 Kraków',
    '3334445556',
    '56.10.A',
    'Turyści i rodziny 25-55 lat',
    50.0578,
    19.9385,
    user6.id,
    [tagRestauracja.id],
  );

  const business7 = await createBusiness(
    'Centrum Handlowe Bonarka',
    'Nowoczesne centrum handlowe z szeroką ofertą sklepów i rozrywki',
    'ul. Kamieńskiego 11, 30-644 Kraków',
    '7778889990',
    '47.19.Z',
    'Rodziny z dziećmi i młodzież 15-45 lat',
    50.0312,
    19.9567,
    user7.id,
    [tagHandel.id, tagOutdoor.id],
  );

  // Create adspace types
  const typeBillboard = await createAdspaceType('Billboard', 'Large outdoor billboard');
  const typeWindow = await createAdspaceType('Witryna', 'Shop window display');
  const typeBanner = await createAdspaceType('Baner', 'Banner advertisement');
  const typePoster = await createAdspaceType('Plakat', 'Poster space');
  const typeDigital = await createAdspaceType('Ekran LED', 'Digital LED screen');
  const typeFlyer = await createAdspaceType('Ulotka', 'Flyer');

  // Create 12 varied adspaces with different parameter combinations
  // Adspace 1: Billboard, barter + price
  const adspace1 = await createAdspace(
    business1.id,
    typeFlyer.id,
    'Ulotki przy ladzie',
    'Oferuję eksponowane miejsce na Twoje ulotki w samym sercu lokalu – tuż przy kasie, gdzie finalizujemy każde zamówienie. To strefa o najwyższym skupieniu uwagi klientów.',
    9.9,
    21,
    '/offer_1.png',
    true,
    80,
  );

  // Adspace 2: Window, no barter, with price
  const adspace2 = await createAdspace(
    business2.id,
    typeWindow.id,
    'Witryna w oknie',
    'Twoja reklama na pierwszej linii frontu! Udostępniam przestrzeń w głównej witrynie lokalu, wychodzącej bezpośrednio na ruchliwą ulicę. To nasz magnes na klientów.',
    200,
    150,
    '/offer_2.png',
    true,
    95,
  );

  // Adspace 3: Banner, barter only (no price)
  await createAdspace(
    business3.id,
    typePoster.id,
    'Plakat A2 (42cm x  59,4cm)',
    'dostępniam eksponowane miejsce na ścianie pod plakat w formacie A2 (42x59,4 cm). To nie jest zwykła tablica ogłoszeniowa – oferuję solową przestrzeń na czystej, białej ścianie w głównej sali.',
    42,
    59.4,
    '/offer_3.png',
    true,
  );

  // Adspace 4: Poster, no barter, with price
  await createAdspace(
    business1.id,
    typeFlyer.id,
    'Ulotki przy ladzie',
    'Oferuję eksponowane miejsce na Twoje ulotki w samym sercu lokalu – tuż przy kasie, gdzie finalizujemy każde zamówienie. To strefa o najwyższym skupieniu uwagi klientów.',
    9.9,
    21,
    '/offer_1.png',
    false,
    65,
  );

  // Adspace 5: Billboard, barter + price (high price)
  await createAdspace(
    business5.id,
    typeBillboard.id,
    'Billboard Bronowice',
    'Billboard przy centrum handlowym, duży ruch pieszych i samochodów',
    800,
    400,
    'https://placehold.co/800x400',
    true,
    1200,
  );

  // Adspace 6: Digital LED, no barter, high price
  await createAdspace(
    business5.id,
    typeDigital.id,
    'Ekran LED Bronowice',
    'Nowoczesny ekran LED z możliwością wyświetlania animacji',
    1920,
    1080,
    'https://placehold.co/1920x1080',
    false,
    2500,
  );

  // Adspace 7: Window, barter only (no price)
  await createAdspace(
    business6.id,
    typeWindow.id,
    'Witryna restauracji',
    'Elegancka witryna restauracji na ul. Grodzkiej',
    180,
    120,
    'https://placehold.co/180x120',
    true,
  );

  // Adspace 8: Poster, barter + low price
  await createAdspace(
    business6.id,
    typePoster.id,
    'Plakat przy kasie',
    'Miejsce na plakat przy kasie restauracji',
    50,
    70,
    'https://placehold.co/50x70',
    true,
    30,
  );

  // Adspace 9: Banner, no barter, with price
  await createAdspace(
    business7.id,
    typeBanner.id,
    'Baner wewnętrzny Bonarka',
    'Duży baner w głównej alei centrum handlowego',
    500,
    150,
    'https://placehold.co/500x150',
    false,
    450,
  );

  // Adspace 10: Digital LED, barter + price
  await createAdspace(
    business7.id,
    typeDigital.id,
    'Ekran LED parking',
    'Ekran LED przy wjeździe na parking centrum',
    1280,
    720,
    'https://placehold.co/1280x720',
    true,
    1800,
  );

  // Adspace 11: Billboard, no barter, no price (barter only implicit)
  await createAdspace(
    business1.id,
    typeBillboard.id,
    'Billboard Planty',
    'Mniejszy billboard przy Plant, idealne miejsce dla lokalnych firm',
    400,
    200,
    'https://placehold.co/400x200',
    true,
  );

  // Adspace 12: Window, no barter, low price
  await createAdspace(
    business3.id,
    typeWindow.id,
    'Mała witryna boczna',
    'Boczna witryna kawiarni, mniejsza ale z dobrą widocznością',
    100,
    80,
    'https://placehold.co/100x80',
    false,
    50,
  );

  // Create sample chats
  const chat1 = await createChat(user1.id, user2.id, [adspace1.id]);
  const chat2 = await createChat(user3.id, user5.id, [adspace2.id]);

  // Create messages
  await createMessage(
    chat1.id,
    user1.id,
    'Cześć! Czy jesteś zainteresowany reklamą na naszym billboardzie?',
    true,
  );
  await createMessage(chat1.id, user2.id, 'Tak, bardzo! Jakie są warunki?', true);
  await createMessage(
    chat1.id,
    user1.id,
    'Oferujemy 750 zł za tydzień lub możliwość barteru.',
    false,
  );

  await createMessage(
    chat2.id,
    user3.id,
    'Widziałem waszą ofertę witryny. Czy jest jeszcze dostępna?',
    true,
  );
  await createMessage(
    chat2.id,
    user5.id,
    'Tak, zapraszamy do kontaktu w sprawie szczegółów!',
    false,
  );

  console.log('\nSeeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
