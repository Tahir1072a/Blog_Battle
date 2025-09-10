import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";

import connectDB from "../config/database.js";
import { createNewBattle } from "../services/matchingService.js";

dotenv.config({ path: "./server/.env" });

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Veritabanı temizleniyor...");
    await User.deleteMany();
    await Blog.deleteMany();
    await Battle.deleteMany();
    await Vote.deleteMany();
    console.log("Veritabanı temizlendi.");

    console.log("Örnek kullanıcılar oluşturuluyor...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const users = await User.create([
      {
        name: "Ayşe Yılmaz",
        email: "ayse@example.com",
        password: hashedPassword,
      },
      {
        name: "Mehmet Kaya",
        email: "mehmet@example.com",
        password: hashedPassword,
      },
      {
        name: "Ahmet Kaya",
        email: "ahmet@example.com",
        password: hashedPassword,
      },
      {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      },
    ]);
    console.log(`${users.length} kullanıcı oluşturuldu.`);

    console.log("Örnek blog yazıları oluşturuluyor...");
    const blogs = await Blog.create([
      {
        title: "Uzay Yolculuğunun Geleceği ve Mars Kolonileri",
        content:
          "İnsanlığın uzaydaki bir sonraki büyük adımı Mars olacak. Bu yazıda, Mars'a yapılacak olası yolculukları ve orada kurulacak kolonilerin zorluklarını inceliyoruz...",
        imageUrl: "http://localhost:5000/api/uploads/sample-space.jpg",
        category: "Teknoloji",
        author: users[0]._id,
      },
      {
        title: "Antik Mısır'ın Gizemli Dünyasına Bir Bakış",
        content:
          "Piramitler, firavunlar ve hiyeroglifler... Antik Mısır medeniyeti, binlerce yıldır insanlığı büyülemeye devam ediyor. Bu kadim uygarlığın sırlarını aralayalım.",
        imageUrl: "http://localhost:5000/api/uploads/sample-egypt.jpg",
        category: "Tarih",
        author: users[1]._id,
      },
      {
        title: "Yapay Zeka Sanat Yapabilir mi? Tartışmalar ve Örnekler",
        content:
          "Son yıllarda yapay zeka tarafından üretilen sanat eserleri büyük ilgi görüyor. Peki bir makine gerçekten 'yaratıcı' olabilir mi? Bu felsefi ve teknolojik tartışmayı ele alıyoruz.",
        imageUrl: "http://localhost:5000/api/uploads/sample-ai-art.jpg",
        category: "Teknoloji",
        author: users[0]._id,
      },
      {
        title: "Japon Mutfağının İncelikleri: Suşiden Daha Fazlası",
        content:
          "Japon mutfağı denince akla ilk suşi gelse de, bu zengin kültür ramen, tempura ve daha nice lezzeti barındırıyor. Gelin bu lezzet yolculuğuna birlikte çıkalım.",
        imageUrl: "http://localhost:5000/api/uploads/sample-sushi.jpg",
        category: "Gastronomi",
        author: users[1]._id,
      },
    ]);
    console.log(`${blogs.length} blog yazısı oluşturuldu.`);

    console.log("Örnek savaşlar oluşturuluyor...");
    await createNewBattle();
    await createNewBattle();
    console.log("2 aktif savaş oluşturuldu.");

    console.log("✨ Veritabanı başarıyla dolduruldu! ✨");
    process.exit();
  } catch (error) {
    console.error("Seed işlemi sırasında hata:", error);
    process.exit(1);
  }
};

seedDatabase();
