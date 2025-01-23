# Kullanıcı Yönetim Sistemi API

Bu proje, kullanıcı yönetimi için RESTful API servisleri sunan bir Node.js uygulamasıdır. Kullanıcı kaydı, girişi, şifre sıfırlama ve kullanıcı bilgilerini yönetme gibi temel işlevleri içerir.RESTful API, istemcilerle sunucular arasında veri alışverişi yapmanın standart bir yoludur. HTTP metotları kullanır, web tabanlı uygulamalar için tasarlanmıştır.

## Teknolojiler

- **Node.js**: Sunucu tarafı JavaScript runtime
- **Express**: Web uygulama çatısı
- **MySQL**: Veritabanı
- **Sequelize**: ORM (Object-Relational Mapping)
- **JWT**: Kimlik doğrulama için JSON Web Token
- **Bcrypt**: Şifre hashleme
- **Mocha & Chai**: Test framework'ü

## Proje Yapısı

```
├── models/                 # Veritabanı modelleri
│   ├── index.js           # Model ilişkileri ve Sequelize yapılandırması
│   ├── User.js            # Kullanıcı modeli
│   └── PasswordReset.js   # Şifre sıfırlama modeli
│
├── routes/                # API route'ları
│   ├── auth.js           # Kimlik doğrulama route'ları
│   └── users.js          # Kullanıcı işlemleri route'ları
│
├── middleware/           # Middleware fonksiyonları
│   └── authMiddleware.js # JWT doğrulama ve rol kontrolü
│
├── test/                 # Test dosyaları
│   ├── api.test.js       # API endpoint testleri
│   ├── db.test.js        # Veritabanı bağlantı testleri
│   ├── authMiddleware.test.js  # Middleware testleri
│   └── models/           # Model testleri
│       ├── user.test.js
│       └── passwordReset.test.js
│
├── app.js               # Ana uygulama dosyası
├── .env                 # Ortam değişkenleri
└── package.json         # Proje bağımlılıkları
```

## Dosya İşlevleri

### 1. Models

#### User.js

```javascript
class User extends Model {
  // Şifre karşılaştırma metodu
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

// Model tanımlaması
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true },
  },
  // ... diğer alanlar
});
```

#### PasswordReset.js

```javascript
class PasswordReset extends Model {
  // Token süre kontrolü
  isExpired() {
    return new Date() > this.expiresAt;
  }
}

PasswordReset.init({ // başlatmak, ilk değer atamak
  userId: {
    type: DataTypes.INTEGER,
    references: { model: "users", key: "id" },
  },
  token: DataTypes.STRING,
  expiresAt: DataTypes.DATE,
});
```

### 2. Routes

#### auth.js

- `/register`: Yeni kullanıcı kaydı
- `/login`: Kullanıcı girişi
- `/forgot-password`: Şifre sıfırlama talebi
- `/reset-password`: Şifre sıfırlama

#### users.js

- GET `/users`: Tüm kullanıcıları listele (admin)
- GET `/users/:id`: Kullanıcı bilgilerini getir
- PUT `/users/:id`: Kullanıcı bilgilerini güncelle
- DELETE `/users/:id`: Kullanıcı sil (admin)

### 3. Middleware

#### authMiddleware.js

- `authenticateToken`: JWT token doğrulama
- `authorizeRole`: Rol bazlı yetkilendirme
- `validateEmail`: E-posta format kontrolü
- `validatePassword`: Şifre güvenlik kontrolü

## Test Süreci

### 1. Model Testleri

- Kullanıcı oluşturma validasyonları
- Şifre hashleme ve karşılaştırma
- Şifre sıfırlama token kontrolü

### 2. API Testleri

- Kayıt ve giriş işlemleri
- Kullanıcı bilgileri güncelleme
- Şifre sıfırlama süreci

### 3. Middleware Testleri

- Token doğrulama
- Rol bazlı yetkilendirme
- Veri validasyonları

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
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

3. Veritabanını oluşturun:

```bash
mysql -u root -e "CREATE DATABASE kullanici_yonetim_sistemi"
```

4. Uygulamayı başlatın:

```bash
npm start
```

5. Testleri çalıştırın:

```bash
npm test
```

## Güvenlik Özellikleri

1. **Şifre Güvenliği**

   - Bcrypt ile şifre hashleme
   - Minimum 8 karakter
   - En az 1 büyük harf ve 1 rakam

2. **Kimlik Doğrulama**

   - JWT tabanlı token sistemi
   - Token süre sınırı (24 saat)

3. **Yetkilendirme**

   - Rol bazlı erişim kontrolü (user/admin)
   - Route bazlı yetkilendirme

4. **Veri Validasyonu**
   - E-posta format kontrolü
   - Şifre güvenlik kontrolü
   - Giriş verisi sanitizasyonu

## Hata Yönetimi

1. **Kimlik Doğrulama Hataları**

   - 401: Token eksik
   - 403: Geçersiz token veya yetki

2. **Validasyon Hataları**

   - 400: Geçersiz veri formatı
   - 422: Eksik veya hatalı veri

3. **Veritabanı Hataları**
   - 404: Kayıt bulunamadı

## Geliştirme Süreci

1. **Veritabanı Tasarımı**

   - Tablo yapıları ve ilişkiler
   - Model validasyonları

2. **API Geliştirme**

   - Route tanımlamaları
   - Middleware entegrasyonu
   - Hata yönetimi

3. **Test Geliştirme**
   - Birim testler
   - Entegrasyon testleri
   - Test verisi yönetimi
