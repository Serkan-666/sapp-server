import { sequelize, DataTypes } from "./index.js";

const t_user = sequelize.define(
  "t_user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isConnected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

export default t_user;
