import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/errorMiddleware.js";
import cron from "node-cron";
import {
  resolveExpiredBattles,
  checkAndCreateNewBattles,
} from "./services/bracketService.js";

import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blog Battle API Çalışıyor!");
});

app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));

cron.schedule("*/5 * * * *", async () => {
  console.log(
    "⏰ Zamanlanmış görev çalışıyor: Süresi dolan savaşlar kontrol ediliyor..."
  );
  try {
    const resolvedCount = await resolveExpiredBattles();
    if (resolvedCount > 0) {
      console.log(
        `✅ ${resolvedCount} adet süresi dolan savaş sonlandırıldı ve yenileri tetiklendi.`
      );
    } else {
      console.log("💨 Süresi dolan savaş bulunamadı.");
    }

    console.log(
      "💨 Aktif savaş sayısı kontrol ediliyor ve gerekirse yenileri oluşturuluyor..."
    );
    await checkAndCreateNewBattles();
  } catch (error) {
    console.error("❌ Zamanlanmış görev sırasında bir hata oluştu:", error);
  }
});
