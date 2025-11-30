const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  stats,
  getAllAssets,
  getAssetById,
} = require("../controllers/assetController");

const router = express();

// Protected routes
router.get("/stats", authMiddleware, stats);
router.get("/", authMiddleware, getAllAssets);
router.get("/:id", authMiddleware, getAssetById);

module.exports = router;
