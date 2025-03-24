import express from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;
const DATA_FILE = "users.json";

// Fayl mavjudligini tekshirish va yaratish
const checkFile = async () => {
  try {
    await fsPromises.access(DATA_FILE);
  } catch (error) {
    await fsPromises.writeFile(DATA_FILE, "[]");
    console.log("users.json fayl yaratildi");
  }
};
await checkFile();

// Middleware
app.use(express.json());

// JSON faylni o‘qish
const readUsers = async () => {
  try {
    const data = await fsPromises.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("users.json faylni oqishda xatolik:", error);
    return [];
  }
};

// JSON faylga yozish
const writeUsers = async (users) => {
  try {
    await fsPromises.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("users.json faylni yozishda xatolik:", error);
  }
};

// Register 
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email va parol talab qilinadi" });
  }

  const users = await readUsers();
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Bunday foydalanuvchi allaqachon mavjud" });
  }

  const newUser = { id: uuidv4(), email, password };
  users.push(newUser);
  await writeUsers(users);

  res.status(201).json({
    message: "Foydalanuvchi ro'yxatdan o'tkazildi",
    userId: newUser.id,
  });
});

// Login qilish
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email va parol talab qilinadi" });
  }

  const users = await readUsers();
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Email yoki parol notogri" });
  }

  res.json({ message: "Kirish muvaffaqiyatli", userId: user.id });
});

app.listen(PORT, () => {
  console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
