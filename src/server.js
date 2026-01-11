require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Phục vụ các file tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("DB Ok"));

// Đăng ký các Route trực tiếp
const authCtrl = require("./controllers/authController");
const weatherService = require("./services/weatherService");
const City = require("./models/City");
const authMid = require("./middleware/authMiddleware");

app.post("/api/register", authCtrl.register);
app.post("/api/login", authCtrl.login);

// Route cụ thể cho cities.json
app.get("/cities.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "../../frontend/cities.json"));
});

app.get("/api/weather", authMid, async (req, res) => {
  const city = await City.findOne({ name: req.query.cityName });
  if (!city) return res.status(404).send("Không có tỉnh này");
  const data = await weatherService.fetchAndInterpolate(
    city.latitude,
    city.longitude
  );
  res.json({ city: city.name, data });
});

// Route mặc định trả về login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/login.html"));
});

app.listen(5000, () => console.log("Server on 5000"));
