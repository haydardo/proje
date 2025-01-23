require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Ana endpoint
app.get("/", (req, res) => {
  res.json({ message: "Kullanıcı Yönetim Sistemi API'sine Hoş Geldiniz" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu", error: err.message });
});

// Veritabanı bağlantısı ve sunucuyu başlat
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı");
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch((error) => {
    console.error("Veritabanı bağlantı hatası:", error);
  });

module.exports = app;
