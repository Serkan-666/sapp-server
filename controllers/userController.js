// controllers/userController.js
import t_user from "../models/t_user.js";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { broadcastMessage, connections } from "../websocketUtils.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../utils/validation.js";
const { sign } = jwt;

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    await validateRegisterUser(username, password, t_user);

    const hashedPassword = await hash(password, 10);

    const user = await t_user.create({ username, password: hashedPassword });

    broadcastMessage(JSON.stringify({ type: "REGISTER", user }));

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    await validateLoginUser(username, password, t_user, connections);

    const token = sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    return res.status(200).json({ username, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await t_user.findAll();
    users.sort((a, b) => b.isConnected - a.isConnected);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Veriler alınamadı" });
  }
};

export { register, login, getAllUsers };
