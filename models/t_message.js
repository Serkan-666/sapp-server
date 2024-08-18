import { sequelize, DataTypes } from "./index.js";

const t_message = sequelize.define(
  "t_message",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "t_users",
        key: "username",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default t_message;
