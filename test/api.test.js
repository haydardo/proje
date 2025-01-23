const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { User, PasswordReset } = require("../src/models");
const chai = require("chai");
const chaiHttp = require("chai-http");

describe("API Tests", () => {
  const TEST_USER_EMAIL = "test_api_user@example.com";
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Sadece test kullanıcısını oluştur
    testUser = await User.create({
      email: TEST_USER_EMAIL,
      password: "Test123!",
      firstName: "Test",
      lastName: "User",
      role: "user",
    });
  });

  afterEach(async () => {
    // Sadece test kullanıcısını ve onunla ilişkili kayıtları sil
    await PasswordReset.destroy({
      where: { userId: testUser.id },
    });
    await User.destroy({
      where: { email: TEST_USER_EMAIL },
    });
  });

  describe("Authentication", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "test_register@example.com",
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");

      // Kayıt olan test kullanıcısını sil
      await User.destroy({
        where: { email: "test_register@example.com" },
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: TEST_USER_EMAIL,
        password: "Test123!",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      authToken = res.body.token;
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: TEST_USER_EMAIL,
        password: "wrongpassword",
      });
      expect(res.status).to.equal(401);
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "Test123!",
      });
      expect(res.status).to.equal(401);
    });
  });

  describe("Password Reset", () => {
    it("should create password reset request", async () => {
      const res = await request(app).post("/auth/forgot-password").send({
        email: TEST_USER_EMAIL,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
    });

    it("should reset password with valid token", async () => {
      const resetRequest = await request(app)
        .post("/auth/forgot-password")
        .send({
          email: TEST_USER_EMAIL,
        });

      const res = await request(app).post("/auth/reset-password").send({
        token: resetRequest.body.token,
        newPassword: "NewTest123!",
      });
      expect(res.status).to.equal(200);
    });

    it("should not reset password with invalid token", async () => {
      const res = await request(app).post("/auth/reset-password").send({
        token: "invalid-token",
        newPassword: "NewTest123!",
      });
      expect(res.status).to.equal(400);
    });
  });
});
