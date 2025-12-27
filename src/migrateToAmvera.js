import dotenv from "dotenv";
dotenv.config();

import prismaLocal from "./prismaLocal.js";
import prismaRemote from "./prismaRemote.js";

async function migrate() {
  try {
    // ==== Пользователи ====
    const users = await prismaLocal.user.findMany();
    for (const u of users) {
      await prismaRemote.user.create({
        data: {
          id: u.id, // сохраняем id, чтобы связи с подарками сохранились
          name: u.name,
          code: u.code,
          wheelSpun: u.wheelSpun,
          createdAt: u.createdAt,
        },
      });
    }

    // ==== Подарки ====
    const gifts = await prismaLocal.gift.findMany();
    for (const g of gifts) {
      await prismaRemote.gift.create({
        data: {
          id: g.id,
          title: g.title,
          imageUrl: g.imageUrl,
          isTaken: g.isTaken,
          userId: g.userId,
        },
      });
    }

    // ==== Логи ====
    const logs = await prismaLocal.log.findMany();
    for (const l of logs) {
      await prismaRemote.log.create({
        data: {
          id: l.id,
          action: l.action,
          userId: l.userId,
          meta: l.meta,
          createdAt: l.createdAt,
        },
      });
    }

    console.log("Миграция данных завершена!");
  } catch (e) {
    console.error("Ошибка при миграции:", e);
  } finally {
    await prismaLocal.$disconnect();
    await prismaRemote.$disconnect();
  }
}

migrate();
