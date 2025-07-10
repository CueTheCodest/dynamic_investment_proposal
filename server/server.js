const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Investment levels data
const investmentLevels = [
  "1 Month",
  "Daily",
  "10X",
  "100X"
];

// API endpoint
app.get('/api', (req, res) => {
  res.json({ levels: investmentLevels });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
