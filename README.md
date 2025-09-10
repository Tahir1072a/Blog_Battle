# 📝 Blog Battle Platform

Kullanıcıların blog yazılarını paylaştığı ve bu yazıların birbiriyle "savaştığı" etkileşimli bir platform. Kullanıcılar yazıları karşılaştırarak oy verir, kazanan yazılar seviye atlar ve yazarları deneyim puanı kazanır.

## 🚀 Özellikler

### 👤 Kullanıcı Özellikleri

- **Hesap Yönetimi**: Kayıt olma, giriş yapma ve profil yönetimi
- **Blog Yazma**: Resim yükleme ile zenginleştirilmiş blog yazıları oluşturma
- **Oylama Sistemi**: Sürükleyerek veya tıklayarak blog yazılarına oy verme
- **Seviye Sistemi**: Kazanılan savaşlara göre yazar seviyeleri (Çaylak → Köşe Yazarı → Usta Kalem)
- **Profil Sayfası**: Kişisel istatistikler, yazılar ve oylama geçmişi

### 🎮 Battle Sistemi

- **Otomatik Eşleştirme**: Aynı seviyedeki yazılar otomatik olarak eşleştirilir
- **Sürükle-Bırak Oylama**: Modern ve eğlenceli oylama deneyimi
- **Seviye Ilerlemesi**: Kazanan yazılar bir üst seviyeye yükselir
- **Rozetler**: Başarıya göre özel rozetler (🌱 Yükselen Yıldız, ⭐ Usta Yazar, 🏆 Efsane Kalem)

### 🔧 Admin Paneli

- **Savaş Yönetimi**: Aktif savaşları görüntüleme ve manuel sonlandırma
- **Yeni Savaş Oluşturma**: İhtiyaç halinde manuel savaş başlatma
- **Kullanıcı İstatistikleri**: Platform geneli analytics

## 🛠️ Teknolojiler

### Backend

- **Node.js** + **Express.js**: RESTful API
- **MongoDB** + **Mongoose**: NoSQL veritabanı
- **JWT**: Kimlik doğrulama
- **Multer**: Dosya yükleme
- **Zod**: Veri validasyonu
- **bcryptjs**: Şifre hashleme

### Frontend

- **React 18** + **Vite**: Modern React geliştirme
- **Redux Toolkit**: State yönetimi
- **React Router Dom**: Sayfa yönlendirme
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animasyonlar ve geçişler
- **React Hook Form** + **Zod**: Form yönetimi ve validasyon
- **Axios**: HTTP istekleri

## 📋 Gereksinimler

- Node.js 18+
- MongoDB 5.0+
- npm veya yarn

## 🔧 Kurulum

### 1. Repository'yi klonlayın

```bash
git clone <repository-url>
cd blog-battle-platform
```

### 2. Backend kurulumu

```bash
cd server
npm install
```

### 3. Frontend kurulumu

```bash
cd client
npm install
```

### 4. Ortam değişkenlerini ayarlayın

**server/.env**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://thrfdn_db_user:MmoLqWYdceI3BLX0@blogdb.lp6a4l5.mongodb.net/?retryWrites=true&w=majority&appName=blogDB
JWT_SECRET=717ac9232051a0d135288171694274965ceee58de3be8c772cc81eadfd053ff8
```

**client/.env**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Uygulamayı başlatın

**Backend (Terminal 1)**

```bash
cd server
npm run dev
```

**Frontend (Terminal 2)**

```bash
cd client
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
blog-battle-platform/
├── server/                 # Backend API
│   ├── config/            # Veritabanı konfigürasyonu
│   ├── controllers/       # Route controller'ları
│   ├── middleware/        # Authentication, validation middleware
│   ├── models/           # MongoDB modelleri
│   ├── routes/           # API route tanımları
│   ├── services/         # Business logic servisleri
│   └── server.js         # Ana sunucu dosyası
│
└── client/               # Frontend React uygulaması
    ├── public/           # Statik dosyalar
    ├── src/
    │   ├── components/   # React bileşenleri
    │   │   ├── auth/     # Authentication bileşenleri
    │   │   ├── battle/   # Battle/oylama bileşenleri
    │   │   ├── blog/     # Blog bileşenleri
    │   │   └── common/   # Ortak bileşenler
    │   ├── pages/        # Sayfa bileşenleri
    │   ├── store/        # Redux store ve slice'lar
    │   ├── utils/        # Yardımcı fonksiyonlar
    │   └── App.jsx       # Ana uygulama bileşeni
    └── package.json
```

## 🎯 Kullanım

### Yeni Kullanıcı

1. **Kayıt Ol**: Ana sayfada "Kayıt Ol" butonuna tıklayın
2. **İlk Yazıyı Oluştur**: Giriş yaptıktan sonra "Yazı Oluştur" bölümünden ilk blog yazınızı paylaşın
3. **Oylama Yap**: "Blog Savaşları" bölümünden diğer yazılara oy verin

### Oylama Sistemi

- **Sürükle-Bırak**: Yazıları sola veya sağa sürükleyerek oy verin
- **Tıklama**: Doğrudan kartlara tıklayarak oy verin
- **Butonlar**: Alt kısımdaki "Sol Kartı Seç" veya "Sağ Kartı Seç" butonlarını kullanın

### Seviye Sistemi

- **Çaylak (🌱)**: Yeni başlayanlar için
- **Köşe Yazarı (✍️)**: 3+ yazı, 2+ kazanım
- **Usta Kalem (🖋️)**: 10+ yazı, 8+ kazanım

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Blog Management

- `GET /api/blogs` - Tüm blog yazılarını listele
- `POST /api/blogs` - Yeni blog yazısı oluştur
- `GET /api/blogs/:id` - Blog yazısı detayı
- `PUT /api/blogs/:id` - Blog yazısını güncelle
- `DELETE /api/blogs/:id` - Blog yazısını sil

### Battle System

- `GET /api/battles` - Aktif savaşları listele
- `POST /api/battles/create` - Yeni savaş oluştur

### Voting

- `POST /api/votes` - Savaşa oy ver
- `GET /api/votes/my-votes` - Kullanıcının oyladığı savaşlar

### User Profile

- `GET /api/users/profile` - Kullanıcı profil bilgileri

### Admin (Admin yetkisi gerekli)

- `GET /api/admin/battles` - Tüm savaşları listele
- `POST /api/admin/battles/:id/resolve` - Savaşı manuel sonlandır
- `POST /api/admin/battles/create` - Manuel savaş oluştur

## 🎨 UI/UX Özellikleri

- **Responsive Design**: Mobil ve desktop uyumlu
- **Dark/Light Mode**: Kullanıcı tercihine göre tema
- **Smooth Animations**: Framer Motion ile akıcı geçişler
- **Loading States**: Kullanıcı deneyimini artıran yükleme durumları
- **Error Handling**: Anlaşılır hata mesajları
- **Toast Notifications**: Başarı/hata bildirimleri

## 🧪 Geliştirme

### Script'ler

```bash
# Backend
npm run dev        # Development modu
npm start          # Production modu
npm run seed       # Test verisi oluştur

# Frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Build önizlemesi
```

### Test Verisi Oluşturma

```bash
cd server
npm run seed
```

## 🚀 Deploy

### Backend Deploy

1. MongoDB Atlas veya herhangi bir MongoDB servisi ayarlayın
2. Ortam değişkenlerini production değerleriyle güncelleyin
3. Heroku, Railway veya benzeri bir servise deploy edin

### Frontend Deploy

1. `VITE_API_BASE_URL`'i production API URL'si ile güncelleyin
2. Build alın: `npm run build`
3. Netlify, Vercel veya benzeri bir servise deploy edin

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Bug Raporu

Herhangi bir hata ile karşılaştıysanız, lütfen GitHub Issues bölümünden bildirin.

## 📞 İletişim

- GitHub: [Your GitHub Profile]
- Email: your.email@example.com

---

⭐ **Beğendiyseniz yıldız vermeyi unutmayın!**
