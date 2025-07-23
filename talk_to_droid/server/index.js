const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Droid backend is online!");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message);

  // Dummy response
  const reply = `You said: "${message}" - but I'm just a droid, so I don't really understand yet!`;

  res.json({ reply });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
