const { Sequelize } = require("sequelize");
const config = require("../config/database");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
  }
);

const User = require("./User")(sequelize);
const PasswordReset = require("./PasswordReset")(sequelize);

// İlişkileri tanımla
User.hasMany(PasswordReset, {
  foreignKey: "userId",
  as: "passwordResets",
});

PasswordReset.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  sequelize,
  User,
  PasswordReset,
};
