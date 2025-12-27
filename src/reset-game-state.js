import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetGameState() {
  await prisma.user.updateMany({
    data: {
      wheelSpun: false,
    },
  });

  await prisma.gift.updateMany({
    data: {
      userId: null,
      isTaken: false,
    },
  });

  console.log("Состояние игры обнулено, имена, коды и подарки сохранены.");
}

resetGameState()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
