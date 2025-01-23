const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  authenticateToken,
  authorizeRole,
  validatePassword,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Tüm kullanıcıları listeleme route'u (sadece admin erişebilir)
router.get(
  "/",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      // Tüm kullanıcıların veritabanından çekilmesi
      const users = await User.findAll({
        attributes: [
          "id",
          "email",
          "password",
          "firstName",
          "lastName",
          "role",
        ],
      });

      // Başarılı yanıt dönülmesi
      res.json(users);
    } catch (error) {
      console.error("Kullanıcı listesi hatası:", error);
      res.status(500).json({ error: "Kullanıcılar getirilemedi" });
    }
  }
);

// Belirli bir kullanıcının bilgilerini getirme route'u
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    // Kullanıcı ID'sinin alınması
    const userId = req.params.id;

    // Kullanıcının kendi bilgilerine veya admin'in erişimi kontrol edilir
    if (req.user.role !== "admin" && req.user.userId !== parseInt(userId)) {
      return res.status(403).json({ error: "Bu işlem için yetkiniz yok" });
    }

    // Kullanıcının veritabanından bulunması
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "password", "firstName", "lastName", "role"],
    });

    // Kullanıcı bulunamazsa hata dönülmesi
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Başarılı yanıt dönülmesi
    res.json(user);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    res.status(500).json({ error: "Kullanıcı getirilemedi" });
  }
});

// Kullanıcı bilgilerini güncelleme (Update)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin", "user"]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { firstName, lastName, email, password } = req.body;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }

      if (req.user.role !== "admin" && req.user.userId !== user.id) {
        return res.status(403).json({
          message:
            "Erişim reddedildi: Yalnızca admin veya kullanıcı kendisini güncelleyebilir.",
        });
      }

      if (password && !validatePassword(password)) {
        return res.status(400).json({
          message:
            "Şifre en az 8 karakter, bir büyük harf, bir rakam ve bir özel karakter (!@#$%^&*) içermelidir",
        });
      }

      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        password: password ? await bcrypt.hash(password, 10) : user.password,
      });

      // Şifreyi response'dan çıkar
      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.status(200).json({
        message: "Kullanıcı başarıyla güncellendi.",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      res
        .status(500)
        .json({ message: "Güncelleme sırasında hata oluştu.", error });
    }
  }
);

// Kullanıcı silme (Delete)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }

      await user.destroy();
      res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      res
        .status(500)
        .json({ message: "Kullanıcı silinirken bir hata oluştu." });
    }
  }
);

module.exports = router;
