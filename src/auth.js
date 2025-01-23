const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { User, PasswordReset } = require("../models");
const {
  validateEmail,
  validatePassword,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Global transporter değişkeni
let transporter;

// Test hesabı ve transporter oluştur
async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.error("Test hesabı oluşturma hatası:", err);
  }
}

// Test hesabını oluştur
createTestAccount();

// Kullanıcı kayıt route'u
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Email ve şifre validasyonu
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Geçersiz email formatı" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Geçersiz şifre formatı" });
    }

    // Email kontrolü
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Bu email zaten kayıtlı" });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || "user",
    });

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET_KEY || "gizli-anahtar",
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ error: "Kayıt işlemi başarısız" });
  }
});

// Kullanıcı giriş route'u
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre validasyonu
    if (!email || !password) {
      return res.status(400).json({ error: "Email ve şifre gereklidir" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // Şifreyi kontrol et
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Geçersiz email veya şifre" });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET_KEY || "gizli-anahtar",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({ error: "Giriş işlemi başarısız" });
  }
});

// Şifre sıfırlama talebi route'u
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Email validasyonu
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Geçersiz email formatı" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Varolan token'ı sil
    await PasswordReset.destroy({ where: { userId: user.id } });

    // Yeni token oluştur
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 saat geçerli

    // Token'ı kaydet
    await PasswordReset.create({
      userId: user.id,
      token: token,
      expiresAt: expiresAt,
    });

    // Yanıt olarak token'ı ve örnek isteği gönder
    res.json({
      message: "Şifre sıfırlama talebi oluşturuldu.",
      resetPasswordExample: {
        endpoint: "/reset-password",
        method: "POST",
        body: {
          token: token,
          newPassword: "yeni-şifreniz",
        },
      },
    });
  } catch (error) {
    console.error("Şifre sıfırlama talebi hatası:", error);
    res.status(500).json({ error: "Şifre sıfırlama talebi başarısız" });
  }
});

// Şifre sıfırlama route'u
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Şifre validasyonu
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: "Geçersiz şifre formatı" });
    }

    // Token'ı bul
    const passwordReset = await PasswordReset.findOne({
      where: { token: token },
    });

    if (!passwordReset) {
      return res
        .status(404)
        .json({ error: "Geçersiz veya süresi dolmuş token" });
    }

    // Token'ın süresini kontrol et
    if (passwordReset.isExpired()) {
      await passwordReset.destroy();
      return res.status(400).json({ error: "Token süresi dolmuş" });
    }

    // Kullanıcıyı bul
    const user = await User.findByPk(passwordReset.userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Şifreyi güncelle
    await user.update({ password: newPassword });

    // Token'ı sil
    await passwordReset.destroy();

    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(500).json({ error: "Şifre sıfırlama başarısız" });
  }
});

module.exports = router;
