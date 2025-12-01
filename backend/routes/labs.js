const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { labDetails } = require("../controllers/labController");

const router = express();

router.get("/", authMiddleware, labDetails);

module.exports = router;
