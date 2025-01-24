# Kullanıcı Yönetim Sistemi API

Bu proje, kullanıcı yönetimi için RESTful API servisleri sunan bir Node.js uygulamasıdır. Kullanıcı kaydı, girişi, şifre sıfırlama ve kullanıcı bilgilerini yönetme gibi temel işlevleri içerir.

## Teknolojiler

- **Node.js**: Sunucu tarafı JavaScript runtime
- **Express**: Web uygulama çatısı
- **MySQL**: Veritabanı
- **Sequelize**: ORM (Object-Relational Mapping)
- **JWT**: Kimlik doğrulama için JSON Web Token
- **Bcrypt**: Şifre hashleme
- **Joi**: Veri validasyonu
- **Nodemailer**: E-posta gönderimi
- **Mocha & Chai**: Test framework'ü

## Proje Yapısı

```
├── src/                  # Kaynak kodlar
│   ├── config/          # Konfigürasyon dosyaları
│   │   ├── database.js  # Veritabanı ayarları
│   │   └── email.js     # E-posta ayarları
│   │
│   ├── controllers/     # Controller katmanı
│   │   ├── authController.js   # Kimlik doğrulama işlemleri
│   │   └── userController.js   # Kullanıcı işlemleri
│   │
│   ├── middleware/      # Middleware fonksiyonları
│   │   └── authMiddleware.js   # JWT ve validasyon kontrolleri
│   │
│   ├── models/          # Veritabanı modelleri
│   │   ├── index.js     # Model ilişkileri
│   │   ├── User.js      # Kullanıcı modeli
│   │   └── PasswordReset.js # Şifre sıfırlama modeli
│   │
│   ├── routes/          # API route'ları
│   │   ├── authRoutes.js # Kimlik doğrulama route'ları
│   │   └── userRoutes.js # Kullanıcı işlemleri route'ları
│   │
│   ├── services/        # İş mantığı katmanı
│   │   ├── authService.js # Kimlik doğrulama servisi
│   │   └── userService.js # Kullanıcı servisi
│   │
│   ├── utils/           # Yardımcı fonksiyonlar
│   │   ├── validation.js # Joi validasyon şemaları
│   │   └── helpers.js    # Genel yardımcı fonksiyonlar
│   │
│   └── app.js          # Ana uygulama dosyası
│
├── test/               # Test dosyaları
│   ├── api.test.js     # API endpoint testleri
│   ├── db.test.js      # Veritabanı bağlantı testleri
│   ├── authMiddleware.test.js # Middleware testleri
│   └── models/         # Model testleri
│       ├── user.test.js
│       └── passwordReset.test.js
│
├── .env               # Ortam değişkenleri
└── package.json      # Proje bağımlılıkları
```

## API Endpoints

### Kimlik Doğrulama İşlemleri

- `POST /auth/register`: Yeni kullanıcı kaydı
- `POST /auth/login`: Kullanıcı girişi
- `POST /auth/forgot-password`: Şifre sıfırlama talebi
- `POST /auth/reset-password`: Şifre sıfırlama

### Kullanıcı İşlemleri

- `GET /users`: Tüm kullanıcıları listele (admin)
- `GET /users/:id`: Kullanıcı bilgilerini getir
- `PUT /users/:id`: Kullanıcı bilgilerini güncelle
- `DELETE /users/:id`: Kullanıcı sil (admin)

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. `.env` dosyasını oluşturun:

```env
DB_NAME=kullanici_yonetim_sistemi
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
PORT=3000
SECRET_KEY=gizli-anahtar-123

# E-posta ayarları
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

3. Uygulamayı başlatın:

```bash
npm start
```

4. Testleri çalıştırın:

```bash
npm test
```

## Özellikler

### 1. Kullanıcı Yönetimi

- Kullanıcı kaydı ve girişi
- Rol tabanlı yetkilendirme (user/admin)
- Kullanıcı bilgilerini güncelleme
- Kullanıcı silme (admin)

### 2. Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- Joi ile veri validasyonu
- Rol bazlı erişim kontrolü

### 3. Şifre Sıfırlama

- Token tabanlı şifre sıfırlama
- E-posta ile bilgilendirme
- Token süre kontrolü

### 4. Test Kapsamı

- API endpoint testleri
- Model validasyon testleri
- Middleware testleri
- Veritabanı bağlantı testleri

## Hata Yönetimi

1. **Kimlik Doğrulama Hataları**

   - 401: Token bulunamadı
   - 403: Geçersiz token veya yetki hatası

2. **Validasyon Hataları**

   - 400: Geçersiz veri formatı
   - 422: Eksik veya hatalı veri

3. **Veritabanı Hataları**
   - 404: Kayıt bulunamadı
   - 500: Sunucu hatası

## Geliştirme Prensipleri

1. **MVC Mimarisi**

   - Model: Veritabanı şemaları ve iş mantığı
   - Controller: İstek/yanıt yönetimi
   - Service: İş mantığı katmanı
   - View: API yanıtları (JSON)

2. **Kod Organizasyonu**

   - Modüler yapı
   - Tek sorumluluk prensibi
   - DRY (Don't Repeat Yourself)
   - SOLID prensipleri

3. **Test Stratejisi**
   - Birim testler
   - Entegrasyon testleri
   - Test verisi yönetimi
