const { expect } = require("chai");
const { User } = require("../../src/models");

describe("User Model Tests", () => {
  const TEST_USER_EMAIL = "test_user_model@example.com";
  let testUser;

  // Her testten önce test kullanıcısını temizle
  beforeEach(async () => {
    await User.destroy({
      where: { email: TEST_USER_EMAIL },
    });
  });

  // Test bitiminde test kullanıcısını sil
  after(async () => {
    await User.destroy({
      where: { email: TEST_USER_EMAIL },
    });
  });

  describe("Validations", () => {
    it("should create a user with valid data", async () => {
      const user = await User.create({
        email: TEST_USER_EMAIL,
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      });

      expect(user).to.be.an("object");
      expect(user.email).to.equal(TEST_USER_EMAIL);
      expect(user.firstName).to.equal("Test");
      expect(user.lastName).to.equal("User");
    });

    it("should not create a user without email", async () => {
      try {
        await User.create({
          password: "Test123!",
          firstName: "Test",
          lastName: "User",
        });
        throw new Error("User should not be created without email");
      } catch (error) {
        expect(error.name).to.equal("SequelizeValidationError");
      }
    });

    it("should not create a user with invalid email format", async () => {
      try {
        await User.create({
          email: "invalid-email",
          password: "Test123!",
          firstName: "Test",
          lastName: "User",
        });
        throw new Error("User should not be created with invalid email");
      } catch (error) {
        expect(error.name).to.equal("SequelizeValidationError");
      }
    });

    it("should not create a user without password", async () => {
      try {
        await User.create({
          email: TEST_USER_EMAIL,
          firstName: "Test",
          lastName: "User",
        });
        throw new Error("User should not be created without password");
      } catch (error) {
        expect(error.name).to.equal("SequelizeValidationError");
      }
    });
  });

  describe("Instance Methods", () => {
    it("should hash password before saving", async () => {
      const user = await User.create({
        email: TEST_USER_EMAIL,
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      });
      expect(user.password).to.not.equal("Test123!");
      expect(user.password).to.have.lengthOf.above(30);
    });

    it("should correctly compare password", async () => {
      const user = await User.create({
        email: TEST_USER_EMAIL,
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      });
      const isValid = await user.comparePassword("Test123!");
      expect(isValid).to.be.true;
      const isInvalid = await user.comparePassword("WrongPassword");
      expect(isInvalid).to.be.false;
    });
  });
});
