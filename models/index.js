import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
dotenv.config();

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

export { sequelize, DataTypes };
