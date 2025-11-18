// server/assets-router.js
import express from "express";

const router = express.Router();

const imageRegex = /\/.+\.(svg|png|jpg|jpeg)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/;

router.get(imageRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `http://localhost:5173/src${filePath}`);
});

router.get(videoRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `http://localhost:5173/src${filePath}`);
});

export default router;
