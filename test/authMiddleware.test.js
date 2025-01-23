const chai = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  validateUser,
} = require("../src/middleware/authMiddleware");

const { expect } = chai;

describe("Auth Middleware Tests", () => {
  describe("validateUser", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        body: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    it("geçerli kullanıcı verisi için next() çağrılmalı", () => {
      req.body = {
        email: "test@example.com",
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      };

      validateUser(req, res, next);
      expect(next.calledOnce).to.be.true;
    });

    it("geçersiz email için hata dönmeli", () => {
      req.body = {
        email: "invalid-email",
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
      };

      validateUser(req, res, next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.errors[0].message).to.include("email");
    });

    it("geçersiz şifre için hata dönmeli", () => {
      req.body = {
        email: "test@example.com",
        password: "weak",
        firstName: "Test",
        lastName: "User",
      };

      validateUser(req, res, next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.errors[0].message).to.equal(
        "Şifre en az 8 karakter olmalıdır"
      );
    });
  });

  describe("authenticateToken", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        headers: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    afterEach(() => {
      sinon.restore();
    });

    it("token olmadığında 401 dönmeli", () => {
      authenticateToken(req, res, next);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Token bulunamadı" })).to.be.true;
    });

    it("geçerli token için next() çağrılmalı", () => {
      const token = "valid.token.here";
      const decodedToken = { id: 1, email: "test@example.com", role: "user" };

      req.headers.authorization = `Bearer ${token}`;
      sinon.stub(jwt, "verify").returns(decodedToken);

      authenticateToken(req, res, next);
      expect(req.user).to.deep.equal(decodedToken);
      expect(next.calledOnce).to.be.true;
    });

    it("geçersiz token için 403 dönmeli", () => {
      req.headers.authorization = "Bearer invalid.token";
      sinon.stub(jwt, "verify").throws(new Error("Geçersiz token"));

      authenticateToken(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: "Geçersiz token" })).to.be.true;
    });
  });
});
