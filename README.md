# Blog Battle - Yazıların Yarıştığı Oylama Platformu

Bu proje, kullanıcıların blog yazıları oluşturabildiği ve bu yazıların sistem tarafından eşleştirilerek diğer kullanıcılar tarafından oylandığı, gerçek zamanlı bir oylama platformudur. Sistem, kazanan yazıların bir üst tura çıktığı bir eleme (bracket) mantığıyla çalışır.

## 🚀 Temel Özellikler

- **Kullanıcı Sistemi**: JWT tabanlı güvenli kayıt/giriş, profil yönetimi.
- **Blog Yönetimi**: Kullanıcıların başlık, içerik, görsel ve kategori içeren yazılar oluşturabildiği tam kapsamlı CRUD işlemleri.
- **Savaş & Oylama Sistemi**: Yazıların aynı seviyedeki (round) diğer yazılarla rastgele eşleşmesi ve her kullanıcının bir savaşa yalnızca bir kez oy verebilmesi.
- **Gerçek Zamanlı Sonuçlar**: Oylama sonrası sonucun yüzdelik oranlarla animasyonlu bir şekilde anlık olarak gösterilmesi.
- **Bracket & Seviye Sistemi**: Kazanan yazılar bir üst tura (round) yükselir. Kullanıcılar da yazı sayısı ve galibiyetlerine göre "Çaylak", "Köşe Yazarı", "Usta Kalem" gibi seviyelere ulaşır.
- **Bildirimler**: Kullanıcılar, yazıları bir savaşa girdiğinde veya savaş sonuçlandığında bildirim alırlar.
- **Admin Paneli**: Admin rolüne sahip kullanıcılar için özel bir panel üzerinden savaşları manuel olarak başlatma ve sonlandırma.
- **Mobil Uyum ve Swipe**: Özellikle oylama ekranı, mobil cihazlarda kolay kullanım için "swipe" (kaydırma) hareketini destekler.

## 🛠️ Kullanılan Teknolojiler

### Frontend

- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: TailwindCSS & shadcn/ui
- **Animasyon**: Framer Motion
- **Form Yönetimi**: React Hook Form & Zod

### Backend

- **Framework**: Node.js + Express
- **Veritabanı**: MongoDB + Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Dosya Yükleme**: Multer
- **Zamanlanmış Görevler**: Node-cron (Süresi dolan savaşları bitirme ve yeni savaşlar oluşturma)

## 🏃‍♂️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd blog-battle
```

### 2. Backend Kurulumu

Backend sunucusunu kurmak ve çalıştırmak için:

```bash
# Sunucu klasörüne gidin
cd server

# Gerekli paketleri yükleyin
npm install

# .env dosyasını oluşturun ve aşağıdaki gibi doldurun
# MONGODB_URI=mongodb+srv://thrfdn_db_user:MmoLqWYdceI3BLX0@blogdb.lp6a4l5.mongodb.net/?retryWrites=true&w=majority&appName=blogDB
# JWT_SECRET=717ac9232051a0d135288171694274965ceee58de3be8c772cc81eadfd053ff8
# PORT=5000

# Sunucuyu geliştirme modunda başlatın
npm run dev
```

Sunucu `http://localhost:5000` adresinde çalışmaya başlayacaktır.

### 3. Frontend Kurulumu

Frontend arayüzünü kurmak ve çalıştırmak için:

```bash
# Ana dizinden client klasörüne geçin
cd client

# Gerekli paketleri yükleyin
npm install

# .env dosyasını oluşturun ve backend adresini belirtin
# VITE_API_BASE_URL=http://localhost:5000/api

# Arayüzü geliştirme modunda başlatın
npm run dev
```

Arayüz `http://localhost:5173` adresinde açılacaktır.

### 4. Örnek Verileri Yükleme (Seed)

Mülakat gereksinimlerini karşılamak üzere, veritabanını test kullanıcıları, 4 blog yazısı ve 2 aktif savaş ile doldurmak için bir script hazırlanmıştır.

Backend sunucusunu çalıştırdıktan sonra, **yeni bir terminal açın** ve aşağıdaki komutu çalıştırın:

```bash
# Sunucu klasöründe olduğunuzdan emin olun
cd server

# Seed script'ini çalıştırın
npm run seed
```

Bu komut, veritabanını temizleyip gerekli başlangıç verilerini ekleyecektir.

## 👤 Test Kullanıcıları

Seed işlemi sonrası aşağıdaki test kullanıcıları ile sisteme giriş yapabilirsiniz. **Tüm kullanıcıların parolası:** `123456`

- **Admin Kullanıcısı:** `admin@example.com`
- **Normal Kullanıcı 1:** `ayse@example.com`
- **Normal Kullanıcı 2:** `mehmet@example.com`

## 🎮 Kullanım Kılavuzu

1. **Kayıt/Giriş**: Ana sayfadan kayıt ol veya giriş yap
2. **Blog Oluştur**: "Yazı Oluştur" butonu ile yeni blog yazısı ekle
3. **Savaş Alanı**: "Savaş Alanı" sekmesinden aktif oylamalara katıl
4. **Oylama**: İki yazı arasından beğendiğini seç (tıkla veya kaydır)
5. **Profil**: Kendi yazılarını ve oylama geçmişini görüntüle
6. **Admin Panel**: Admin kullanıcıları manuel savaş yönetimi yapabilir

## 🎯 Öne Çıkan Özellikler

- ✅ **Gerçek Zamanlı**: Oylama sonuçları anlık gösterilir
- ✅ **Mobil Dostu**: Swipe ile oylama özelliği
- ✅ **Otomatik Sistem**: Cron job ile otomatik savaş yönetimi
- ✅ **Gamification**: Seviye ve rozet sistemi
- ✅ **Admin Paneli**: Sistem yönetimi için özel arayüz
- ✅ **Responsive**: Tüm cihazlarda uyumlu tasarım

## 📁 Proje Yapısı

```
blog-battle/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── store/          # Redux store & API
│   │   └── utils/          # Yardımcı fonksiyonlar
│   └── package.json
├── server/                 # Backend (Node.js)
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── services/          # İş mantığı
│   ├── middleware/        # Middleware'ler
│   └── routes/            # API routes
└── README.md
```

## 🔧 Geliştirme Notları

- **MongoDB**: Yerel MongoDB kurulumu gerekli
- **Node.js**: v18 veya üzeri önerilen
- **Environment**: `.env` dosyalarını oluşturmayı unutmayın
- **Seed Data**: İlk çalıştırmada mutlaka seed komutunu çalıştırın
