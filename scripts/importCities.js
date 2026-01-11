require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const City = require("../src/models/City");

async function importCities() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB");

    // Đọc file datacities.json
    const dataPath = path.join(__dirname, "../../datacities.json");
    const citiesData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    console.log(`📂 Đã đọc ${citiesData.length} tỉnh từ file`);

    // Xóa dữ liệu cũ (nếu có)
    const deletedCount = await City.deleteMany({});
    console.log(`🗑️  Đã xóa ${deletedCount.deletedCount} tỉnh cũ`);

    // Import dữ liệu mới
    const result = await City.insertMany(citiesData);
    console.log(`✅ Đã import ${result.length} tỉnh vào database`);

    // Kiểm tra lại
    const count = await City.countDocuments();
    console.log(`📊 Tổng số tỉnh trong database: ${count}`);

    // Đóng kết nối
    await mongoose.connection.close();
    console.log("🔌 Đã đóng kết nối MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

importCities();
