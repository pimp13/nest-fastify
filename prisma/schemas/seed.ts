import { PrismaClient, UserRole } from '@prisma/client';
// import { faker } from '@faker-js/faker';
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 20 }).map(() => ({
    isActive: true,
    role: UserRole.USER,
    avatarUrl: faker.image.avatar(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  }));

  await prisma.user.createMany({ data: users });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
