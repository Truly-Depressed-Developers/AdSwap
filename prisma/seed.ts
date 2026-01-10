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
  const user1 = await createUser('user@mail.com', 'Alice', 'Smith', 'user');
  const user2 = await createUser('bob@mail.com', 'Bob', 'Johnson', 'bob');
  const user3 = await createUser('charlie@mail.com', 'Charlie', 'Brown', 'charlie');

  // Create tags
  const [tagCafe, tagRestaurant, tagOutdoor] = await createTags(['Cafe', 'Restaurant', 'Outdoor']);

  // Create businesses
  const business1 = await createBusiness(
    'Coffee Corner',
    'Cozy cafe in the city center',
    '123 Main St, New York',
    '1234567890',
    '56.30.07',
    40.7128,
    -74.006,
    user1.id,
    [tagCafe.id, tagOutdoor.id],
  );

  const business2 = await createBusiness(
    'The Grill House',
    'Premium steakhouse with great views',
    '456 Oak Ave, New York',
    '9876543210',
    '56.30.20',
    40.758,
    -73.9855,
    user2.id,
    [tagRestaurant.id],
  );

  // Create adspace types
  const typeBillboard = await createAdspaceType('Billboard', 'Large outdoor advertisement space');
  const typeWindow = await createAdspaceType('Shop Window', 'Front window display');
  const typeTableTop = await createAdspaceType('Table Display', 'Counter or table top placement');

  // Create adspaces
  const adspace1 = await createAdspace(
    business1.id,
    typeBillboard.id,
    'Main Entrance Billboard',
    'Large billboard at main entrance',
    1600,
    1200,
    'https://example.com/billboard.jpg',
    true,
    500,
  );
  const adspace2 = await createAdspace(
    business1.id,
    typeWindow.id,
    'Front Window',
    'Main shop window display',
    800,
    600,
    'https://example.com/window.jpg',
    false,
    800,
  );
  const adspace3 = await createAdspace(
    business2.id,
    typeTableTop.id,
    'Corner Table',
    'Premium corner table placement',
    400,
    300,
    'https://example.com/table.jpg',
    true,
  );

  // Create chats
  const chat1 = await createChat(user1.id, user2.id, [adspace1.id, adspace2.id]);
  const chat2 = await createChat(user2.id, user3.id, [adspace3.id]);

  // Create messages
  await createMessage(
    chat1.id,
    user1.id,
    'Hi Bob! Are you interested in advertising at our location?',
  );
  await createMessage(
    chat1.id,
    user2.id,
    'Absolutely! Can you tell me more about the billboard rates?',
  );
  await createMessage(
    chat1.id,
    user1.id,
    'Sure! The main billboard is $500/day with great foot traffic.',
  );

  await createMessage(
    chat2.id,
    user2.id,
    'Hello Charlie! I wanted to discuss the table display opportunity.',
  );
  await createMessage(chat2.id, user3.id, 'That sounds interesting! What are you offering?');

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
