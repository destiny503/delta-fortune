import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prismaLocal = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }, // локальная база
  },
});

export default prismaLocal;
