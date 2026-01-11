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
  latitude: number,
  longitude: number,
  ownerId: string,
  tagIds: string[],
) {
  const business = await prisma.business.create({
    data: {
      name,
      description,
      address,
      nip,
      pkd,
      latitude,
      longitude,
      ownerId,
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

async function createMessage(chatId: string, senderId: string, content: string) {
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
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
    'Reklamy Kraków Sp. z o.o.',
    'Profesjonalna agencja reklamowa z wieloletnim doświadczeniem na rynku krakowskim',
    'Rynek Główny 1, 31-042 Kraków',
    '1234567890',
    '73.11.Z',
    50.0619,
    19.9372,
    user1.id,
    [tagReklama.id, tagMarketing.id],
  );

  const business2 = await createBusiness(
    'Sklep Kazimierz',
    'Sklep wielobranżowy',
    'ul. Szeroka 15, 31-053 Kraków',
    '9876543210',
    '47.19.Z',
    50.0515,
    19.9465,
    user2.id,
    [tagHandel.id],
  );

  const business3 = await createBusiness(
    'Kawiarnia Nowa Huta',
    'Klimatyczna kawiarnia w sercu Nowej Huty. Oferujemy najlepszą kawę w okolicy oraz domowe ciasta.',
    'os. Centrum A 1, 31-929 Kraków',
    '5551234567',
    '56.10.A',
    50.0726,
    20.0373,
    user3.id,
    [tagKawiarnia.id],
  );

  const business4 = await createBusiness(
    'Galeria Podgórze',
    'Galeria sztuki współczesnej',
    'ul. Limanowskiego 24, 30-551 Kraków',
    '1112223334',
    '90.04.Z',
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

  // Create 12 varied adspaces with different parameter combinations
  // Adspace 1: Billboard, barter + price
  const adspace1 = await createAdspace(
    business1.id,
    typeBillboard.id,
    'Billboard Rynek Główny',
    'Duży billboard w samym centrum Krakowa, doskonała widoczność z głównego placu',
    600,
    300,
    'https://placehold.co/600x300',
    true,
    750,
  );

  // Adspace 2: Window, no barter, with price
  const adspace2 = await createAdspace(
    business2.id,
    typeWindow.id,
    'Witryna Kazimierz',
    'Przestrzeń reklamowa w witrynie sklepu na ul. Szerokiej',
    200,
    150,
    'https://placehold.co/200x150',
    false,
    200,
  );

  // Adspace 3: Banner, barter only (no price)
  await createAdspace(
    business3.id,
    typeBanner.id,
    'Baner przy wejściu',
    'Baner reklamowy przy głównym wejściu do kawiarni',
    300,
    80,
    'https://placehold.co/300x80',
    true,
  );

  // Adspace 4: Poster, no barter, with price
  await createAdspace(
    business4.id,
    typePoster.id,
    'Plakat w galerii',
    'Miejsce na plakat artystyczny w holu galerii',
    70,
    100,
    'https://placehold.co/70x100',
    false,
    80,
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
  );
  await createMessage(
    chat1.id,
    user2.id,
    'Tak, bardzo! Jakie są warunki?',
  );
  await createMessage(
    chat1.id,
    user1.id,
    'Oferujemy 750 zł za tydzień lub możliwość barteru.',
  );

  await createMessage(
    chat2.id,
    user3.id,
    'Widziałem waszą ofertę witryny. Czy jest jeszcze dostępna?',
  );
  await createMessage(
    chat2.id,
    user5.id,
    'Tak, zapraszamy do kontaktu w sprawie szczegółów!',
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
