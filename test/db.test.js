const { expect } = require("chai");
const { Sequelize } = require("sequelize");
require("dotenv").config();

describe("Database Connection Tests", () => {
  let sequelize;

  before(async () => {
    sequelize = new Sequelize(
      process.env.DB_NAME || "kullanici_yonetim_sistemi",
      process.env.DB_USER || "root",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
      }
    );
  });

  after(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("should connect to the database successfully", async () => {
    try {
      await sequelize.authenticate();
      expect(true).to.be.true;
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  });

  it("should have correct database configuration", () => {
    const config = sequelize.config;
    expect(config.database).to.equal(
      process.env.DB_NAME || "kullanici_yonetim_sistemi"
    );
    expect(config.username).to.equal(process.env.DB_USER || "root");
    expect(config.host).to.equal(process.env.DB_HOST || "127.0.0.1");
    expect(config.port).to.equal(process.env.DB_PORT || 3306);
    expect(sequelize.getDialect()).to.equal("mysql");
  });
});
