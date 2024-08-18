// controllers/messageController.js
import t_message from "../models/t_message.js";
import { broadcastMessage } from "../websocketUtils.js";

const getAllMessages = async (req, res) => {
  try {
    const messages = await t_message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Mesajlar alınamadı" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { content, username } = req.body;

    if (!username) {
      throw new Error("Kullanıcı Adı Boş Olamaz.");
    }
    if (!content) {
      throw new Error("Mesaj Boş Olamaz.");
    }

    const message = await t_message.create({ content, username });
    broadcastMessage(JSON.stringify({ type: "MESSAGE", message }));

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllMessages, createMessage };
