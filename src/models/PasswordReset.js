const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PasswordReset extends Model {
    isExpired() {
      return new Date() > this.expiresAt;
    }
  }

  PasswordReset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PasswordReset",
      tableName: "password_resets",
      underscored: true,
      timestamps: true,
    }
  );

  return PasswordReset;
};
