const authService = require("../services/authService");

// Kullanıcı kaydı
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Bu email adresi zaten kayıtlı" });
    }
    console.error(error);
    res.status(500).json({ message: "Kayıt sırasında bir hata oluştu", error });
  }
};

// Kullanıcı girişi
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};

// Şifre sıfırlama talebi
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.createPasswordReset(email);
    res.status(200).json({
      message: "Şifre sıfırlama token'ı oluşturuldu",
      ...result,
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(404).json({ message: error.message });
  }
};

// Şifre sıfırlama
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
