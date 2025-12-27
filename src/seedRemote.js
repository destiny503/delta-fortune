import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function seed() {
  try {
    const data = JSON.parse(fs.readFileSync("prisma/seed-data.json", "utf-8"));

    // Пользователи
    for (const user of data.users) {
      await prisma.user.create({
        data: {
          id: user.id, // чтобы сохранить id
          name: user.name,
          code: user.code,
          wheelSpun: user.wheelSpun,
          createdAt: new Date(user.createdAt),
        },
      });
    }

    // Подарки
    for (const gift of data.gifts) {
      await prisma.gift.create({
        data: {
          id: gift.id,
          title: gift.title,
          imageUrl: gift.imageUrl,
          isTaken: gift.isTaken,
          userId: gift.userId || null,
        },
      });
    }

    // Логи
    for (const log of data.logs) {
      await prisma.log.create({
        data: {
          id: log.id,
          action: log.action,
          userId: log.userId || null,
          meta: log.meta || null,
          createdAt: new Date(log.createdAt),
        },
      });
    }

    console.log("✅ База на Amvera заполнена");
  } catch (err) {
    console.error("Ошибка при заполнении базы:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
