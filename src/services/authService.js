const { User, PasswordReset } = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AuthService {
  async register(userData) {
    const user = await User.create(userData);
    const token = this.generateToken(user);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Geçersiz email veya şifre");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Geçersiz email veya şifre");
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async createPasswordReset(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 saat geçerli

    await PasswordReset.create({
      userId: user.id,
      token,
      expiresAt,
    });

    return { token, expiresAt }; //dönen response
  }

  async resetPassword(token, newPassword) {
    const passwordReset = await PasswordReset.findOne({
      where: { token },
      include: [{ model: User, as: "user" }],
    });

    if (!passwordReset || passwordReset.isExpired()) {
      throw new Error("Geçersiz veya süresi dolmuş token");
    }

    const user = passwordReset.user;
    await user.update({ password: newPassword });
    await passwordReset.destroy();
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY || "gizli-anahtar",
      { expiresIn: "24h" }
    );
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}

module.exports = new AuthService();
