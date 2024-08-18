import { Router } from "express";
import {
  getAllMessages,
  createMessage,
} from "../controllers/messageController.js";

const router = Router();

router.get("/getAll", getAllMessages);
router.post("/send", createMessage);

export default router;
