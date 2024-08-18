// routes/userRoutes.js
import { Router } from "express";
import { getAllUsers, register, login } from "../controllers/userController.js";

const router = Router();

router.get("/getAll", getAllUsers);
router.post("/register", register);
router.post("/login", login);

export default router;
