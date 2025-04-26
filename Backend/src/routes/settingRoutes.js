import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getSettings());
});

router.put("/", (req, res) => {
  const updated = updateSettings(req.body);
  res.json(updated);
});

export default router;
