const { User } = require("../models");

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: ["id", "email", "firstName", "lastName", "role"],
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "firstName", "lastName", "role"],
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    return user;
  }

  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    await user.update(userData);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    await user.destroy();
  }

  canAccessUser(requestUser, targetUserId) {
    return (
      requestUser.role === "admin" || requestUser.id === parseInt(targetUserId)
    );
  }
}

module.exports = new UserService();
