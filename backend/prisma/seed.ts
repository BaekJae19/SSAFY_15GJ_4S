import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      nickname: 'Administrator',
      role: 'ADMIN',
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedPassword,
      nickname: 'Student1',
      role: 'STUDENT',
    },
  });

  // Create Daily Knowledge
  await prisma.dailyKnowledge.upsert({
    where: { date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z' },
    update: {},
    create: {
      keyword: 'TypeScript',
      title: 'What is TypeScript?',
      description: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
      content: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
      date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
    },
  });

  // Create Menu
  await prisma.menu.create({
    data: {
      date: new Date(),
      mealType: 'LUNCH',
      items: JSON.stringify(['Rice', 'Kimchi Stew', 'Stir-fried Pork', 'Seaweed']),
    },
  });

  // Create Event
  await prisma.event.create({
    data: {
      title: 'Midterm Exam',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      color: '#EF4444',
      type: 'ACADEMIC',
    },
  });

  // Create Posts
  await prisma.post.create({
    data: {
      title: 'Welcome to the Dashboard',
      content: 'This is a notice for everyone.',
      type: 'NOTICE',
      authorId: admin.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Study group for Algorithms',
      content: 'Anyone wants to join?',
      type: 'COMMUNITY',
      category: 'Study',
      authorId: student.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });