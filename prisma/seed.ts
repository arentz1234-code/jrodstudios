import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed services
  const services = [
    {
      name: "Regular Cut",
      description: "Any cut not taken down to the skin",
      price: 30.0,
      duration: 30,
      sortOrder: 1,
    },
    {
      name: "Skin Fade",
      description: "Any cut shortened down to skin level",
      price: 30.0,
      duration: 45,
      sortOrder: 2,
    },
    {
      name: "Beard Service",
      description: "Professional beard trim and shape",
      price: 20.0,
      duration: 30,
      sortOrder: 3,
    },
    {
      name: "Haircut & Beard",
      description: "Complete hair and beard service",
      price: 45.0,
      duration: 50,
      sortOrder: 4,
    },
    {
      name: "Hot Towel Shave",
      description: "Luxury relaxation service with hot towel",
      price: 65.0,
      duration: 55,
      sortOrder: 5,
    },
    {
      name: "Line Up",
      description: "Edge cleanup and line definition",
      price: 10.0,
      duration: 15,
      sortOrder: 6,
    },
    {
      name: "Facial Hair",
      description: "Mustache & Goatee trim",
      price: 5.0,
      duration: 15,
      sortOrder: 7,
    },
    {
      name: "Eyebrows",
      description: "Eyebrow cleanup",
      price: 5.0,
      duration: 5,
      sortOrder: 8,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/\s+/g, "-") },
      update: service,
      create: {
        id: service.name.toLowerCase().replace(/\s+/g, "-"),
        ...service,
      },
    });
  }

  console.log("Seeded services");

  // Seed business hours
  const businessHours = [
    { dayOfWeek: 0, isOpen: false, openTime: null, closeTime: null }, // Sunday
    { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Monday
    { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Tuesday
    { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Wednesday
    { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Thursday
    { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Friday
    { dayOfWeek: 6, isOpen: true, openTime: "09:00", closeTime: "19:00" }, // Saturday
  ];

  for (const hours of businessHours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: hours.dayOfWeek },
      update: hours,
      create: hours,
    });
  }

  console.log("Seeded business hours");

  // Seed admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@jrodstudios.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@jrodstudios.com",
      password: hashedPassword,
      name: "J.Rod Admin",
    },
  });

  console.log("Seeded admin user");
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
