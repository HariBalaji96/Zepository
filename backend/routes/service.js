const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendService,
  getUnderService,
} = require("../controllers/serviceController");

const router = express();

router.post("/send:id", authMiddleware, sendService);

router.get("/", authMiddleware, getUnderService);

module.exports = router;
