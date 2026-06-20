import express from "express";
import { saveEpisode } from "../services/thebreeth.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await saveEpisode(
      "Hackathon Test Episode"
    );

    return res.json(result);
  } catch (error) {
    console.error(error.response?.data);

    return res.status(500).json({
      error:
        error.response?.data ||
        error.message,
    });
  }
});

export default router;