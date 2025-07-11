const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

// Enable CORS for your frontend
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

// Investment levels data
const investmentLevels = ["1 Month", "Daily", "10X", "100X"];

// API endpoint
app.get("/api", (req, res) => {
  res.json({ levels: investmentLevels });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
