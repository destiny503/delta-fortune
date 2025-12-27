import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("✅ Connected to DB"))
  .catch((e) => console.error("❌ DB connection error:", e));

export default prisma;
