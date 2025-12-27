import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import prisma from "./prisma.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===== Static files =====
app.use(express.static(path.join(process.cwd(), "public")));

// ===== API =====
app.post("/login", async (req, res) => {
  const { code } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { code },
      include: { gift: true },
    });

    if (!user) return res.status(400).json({ error: "Invalid code" });

    await prisma.log.create({
      data: {
        action: "LOGIN",
        userId: user.id,
      },
    });

    res.json({
      name: user.name,
      wheelSpun: user.wheelSpun,
      gift: user.gift,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/spin", async (req, res) => {
  const { code } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { code } });
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    if (user.wheelSpun)
      return res.status(400).json({ error: "Колесо уже прокручено" });

    const availableGifts = await prisma.gift.findMany({
      where: { isTaken: false },
    });

    if (availableGifts.length === 0)
      return res.status(400).json({ error: "Подарки закончились" });

    const randomIndex = Math.floor(Math.random() * availableGifts.length);
    const selectedGift = availableGifts[randomIndex];

    await prisma.gift.update({
      where: { id: selectedGift.id },
      data: { isTaken: true, userId: user.id },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { wheelSpun: true },
    });

    res.json(selectedGift);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== SPA fallback =====
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
