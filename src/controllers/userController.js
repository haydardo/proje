const userService = require("../services/userService");

// Tüm kullanıcıları getir
const getAllUsers = async (req, res) => {
  try {
    // Sadece admin kullanıcıları listeleyebilir
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kullanıcılar getirilirken hata oluştu" });
  }
};

// Belirli bir kullanıcıyı getir
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    // Sadece admin veya kullanıcının kendisi bilgilerini görebilir
    if (!userService.canAccessUser(req.user, id)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error.message === "Kullanıcı bulunamadı") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Kullanıcı getirilirken hata oluştu" });
  }
};

// Kullanıcı güncelle
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    // Sadece admin veya kullanıcının kendisi güncelleyebilir
    if (!userService.canAccessUser(req.user, id)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const updatedUser = await userService.updateUser(id, userData);
    res.status(200).json({
      message: "Kullanıcı başarıyla güncellendi",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "Kullanıcı bulunamadı") {
      return res.status(404).json({ message: error.message });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Bu email adresi zaten kayıtlı" });
    }
    res.status(500).json({ message: "Kullanıcı güncellenirken hata oluştu" });
  }
};

// Kullanıcı sil
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Sadece admin silebilir
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    await userService.deleteUser(id);
    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error(error);
    if (error.message === "Kullanıcı bulunamadı") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
