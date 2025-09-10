# Blog Battle - Yazıların Yarıştığı Oylama Platformu

Blog yazılarının eşleşerek birbirine karşı yarıştığı, gerçek zamanlı oylama tabanlı eleme turnuvası sistemi.

## 🚀 Özellikler

- **Kullanıcı Sistemi**: Kayıt/giriş, profil yönetimi
- **Blog Yönetimi**: Yazı oluşturma (başlık, içerik, görsel, kategori)
- **Savaş Sistemi**: Blogların rastgele eşleşmesi ve oylama
- **Bracket Algoritması**: Kazananların otomatik üst eşleşmelere taşınması
- **Seviye Sistemi**: Çaylak → Köşe Yazarı → Usta Kalem
- **Mobil Uyumlu**: Swipe ile oylama özelliği
- **Admin Panel**: Eşleşmeleri yönetme ve manuel başlatma

## 🛠️ Teknolojiler

**Frontend:**

- React 18 + Vite
- Redux Toolkit (state management)
- TailwindCSS + shadcn/ui
- Framer Motion (animasyonlar)
- React Hook Form + Zod (form validasyonu)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (dosya yükleme)
- Node-cron (zamanlanmış görevler)

## 🏃‍♂️ Kurulum

### 1. Repository'yi klonlayın

```bash
git clone <repository-url>
cd blog-battle
```

### 2. Backend kurulumu

```bash
cd server
npm install
```

### 3. Environment dosyasını oluşturun

```bash
# server/.env dosyası oluşturun
MONGODB_URI=mongodb://localhost:27017/blog-battle
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### 4. Frontend kurulumu

```bash
cd client
npm install
```

### 5. Environment dosyasını oluşturun

```bash
# client/.env dosyası oluşturun
VITE_API_BASE_URL=http://localhost:5000
```

### 6. Uygulamayı çalıştırın

```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 📊 Demo Veriler

Sistemde örnek veriler mevcuttur:

- 4+ blog yazısı
- 2+ aktif eşleşme
- Test kullanıcı hesapları

## 🎮 Kullanım

1. **Kayıt Ol/Giriş Yap**: Hesap oluştur
2. **Yazı Oluştur**: Blog yazısı ekle
3. **Savaş Alanına Git**: Eşleşmelere oy ver
4. **Sonuçları İzle**: Kazananları gör
5. **Seviye Atla**: Başarılarınla ilerle

## 🔧 Önemli Dosyalar

```
├── client/
│   ├── src/components/battle/    # Savaş bileşenleri
│   ├── src/pages/BattlePage.jsx  # Ana savaş sayfası
│   └── src/store/               # Redux store
├── server/
│   ├── controllers/             # API controllers
│   ├── models/                  # Database models
│   ├── services/                # İş mantığı
│   └── routes/                  # API routes
```

## ⚡ Öne Çıkan Özellikler

- **Gerçek Zamanlı Oylama**: Anlık sonuç gösterimi
- **Swipe Özelliği**: Mobilde kaydırarak oylama
- **Otomatik Eşleşme**: Cron job ile yeni savaşlar
- **Seviye Rozeti**: Başarı göstergeleri
- **Responsive Tasarım**: Tüm cihazlarda uyumlu

## 🎯 Bonus Özellikler

✅ Admin paneli - eşleşme yönetimi
✅ Kullanıcı seviyelendirme sistemi
✅ Bildirim sistemi
✅ Animasyonlu geçişler
✅ Dosya yükleme sistemi

---

**Not**: Bu proje Tarvina Yazılım mülakat görevi olarak geliştirilmiştir.
