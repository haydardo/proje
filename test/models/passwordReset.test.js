const { expect } = require("chai");
const { User, PasswordReset } = require("../../src/models");

describe("PasswordReset Model Tests", () => {
  const TEST_USER_EMAIL = "test_password_reset@example.com";
  let testUser;

  // Test başlamadan önce test kullanıcısını oluştur
  before(async () => {
    // Önce varsa eski test kullanıcısını temizle
    await PasswordReset.destroy({
      where: {},
      include: [
        {
          model: User,
          where: { email: TEST_USER_EMAIL },
        },
      ],
    });
    await User.destroy({
      where: { email: TEST_USER_EMAIL },
    });

    // Test kullanıcısını oluştur
    testUser = await User.create({
      email: TEST_USER_EMAIL,
      password: "Test123!",
      firstName: "Test",
      lastName: "User",
    });
  });

  // Her testten önce test kullanıcısının şifre sıfırlama kayıtlarını temizle
  beforeEach(async () => {
    await PasswordReset.destroy({
      where: { userId: testUser.id },
    });
  });

  // Test bitiminde test kullanıcısını ve ilişkili kayıtları sil
  after(async () => {
    await PasswordReset.destroy({
      where: { userId: testUser.id },
    });
    await User.destroy({
      where: { email: TEST_USER_EMAIL },
    });
  });

  describe("Validations", () => {
    it("should create a password reset token with valid data", async () => {
      const passwordReset = await PasswordReset.create({
        userId: testUser.id,
        token: "valid-token",
        expiresAt: new Date(Date.now() + 3600000),
      });

      expect(passwordReset).to.be.an("object");
      expect(passwordReset.userId).to.equal(testUser.id);
      expect(passwordReset.token).to.equal("valid-token");
      expect(passwordReset.expiresAt).to.be.a("date");
    });

    it("should not create a password reset without token", async () => {
      try {
        await PasswordReset.create({
          userId: testUser.id,
          expiresAt: new Date(),
        });
        throw new Error("Should not create without token");
      } catch (error) {
        expect(error.name).to.equal("SequelizeValidationError");
      }
    });

    it("should not create a password reset without expiresAt", async () => {
      try {
        await PasswordReset.create({
          userId: testUser.id,
          token: "valid-token",
        });
        throw new Error("Should not create without expiresAt");
      } catch (error) {
        expect(error.name).to.equal("SequelizeValidationError");
      }
    });
  });

  describe("Instance Methods", () => {
    it("should correctly identify expired tokens", async () => {
      const passwordReset = await PasswordReset.create({
        userId: testUser.id,
        token: "expired-token",
        expiresAt: new Date(Date.now() - 3600000),
      });
      expect(passwordReset.isExpired()).to.be.true;
    });

    it("should correctly identify valid tokens", async () => {
      const passwordReset = await PasswordReset.create({
        userId: testUser.id,
        token: "valid-token",
        expiresAt: new Date(Date.now() + 3600000),
      });
      expect(passwordReset.isExpired()).to.be.false;
    });
  });
});
