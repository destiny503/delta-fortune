import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

process.env.DATABASE_URL =
  process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient();

async function exportDb() {
  const users = await prisma.user.findMany();
  const gifts = await prisma.gift.findMany();
  const logs = await prisma.log.findMany();

  fs.writeFileSync(
    "prisma/seed-data.json",
    JSON.stringify({ users, gifts, logs }, null, 2)
  );

  console.log("✅ Данные выгружены");
}

exportDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
