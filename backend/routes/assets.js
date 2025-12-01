const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  stats,
  getAllAssets,
  getAssetById,
  getAssetTypes,
  addAsset,
  updateAsset,
} = require("../controllers/assetController");

const router = express();

router.post("/add", authMiddleware, addAsset);

// new update route (PUT)
router.put("/:id", authMiddleware, updateAsset);

// Protected routes
router.get("/stats", authMiddleware, stats);
router.get("/types", authMiddleware, getAssetTypes);
router.get("/", authMiddleware, getAllAssets);
router.get("/:id", authMiddleware, getAssetById);

module.exports = router;
