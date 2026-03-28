import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      mobileNumber: '+1234567890',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      isLocked: false,
    },
  });
  console.log('Created admin user:', admin.email);

  // Regular users
  const users = [
    {
      email: 'john@example.com',
      username: 'john_doe',
      mobileNumber: '+1111111111',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      email: 'jane@example.com',
      username: 'jane_doe',
      mobileNumber: '+2222222222',
      firstName: 'Jane',
      lastName: 'Doe',
    },
    {
      email: 'bob@example.com',
      username: 'bob_smith',
      mobileNumber: '+3333333333',
      firstName: 'Bob',
      lastName: 'Smith',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: passwordHash,
        role: 'USER',
        isActive: true,
        isLocked: false,
      },
    });
    console.log('Created user:', user.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });