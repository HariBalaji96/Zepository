const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendService,
  getUnderService,
  completeService,
} = require("../controllers/serviceController");

const router = express();

router.post("/send:id", authMiddleware, sendService);

router.get("/", authMiddleware, getUnderService);
router.put("/complete/:id", authMiddleware, completeService);

module.exports = router;
