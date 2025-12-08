const express = require("express");
const cors = require("cors");

// Authentication Router
const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/assets");
const labRoutes = require("./routes/labs");
const serviceRoutes = require("./routes/service");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/labs", labRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
