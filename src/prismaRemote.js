import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prismaRemote = new PrismaClient({
  datasources: {
    db: { url: process.env.AMVERA_DATABASE_URL },
  },
});

export default prismaRemote;
