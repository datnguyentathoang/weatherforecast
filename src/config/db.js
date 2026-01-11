const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Lấy chuỗi kết nối từ file .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // (Tùy chọn) Kiểm tra xem collection 'cities' có tồn tại không
        const collections = await mongoose.connection.db.listCollections().toArray();
        const hasCities = collections.some(col => col.name === 'cities');
        
        if (hasCities) {
            console.log("📂 Found 'cities' collection in Compass.");
        } else {
            console.warn("⚠️ Warning: 'cities' collection not found. Please import your JSON file.");
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        // Thoát ứng dụng nếu không kết nối được DB
        process.exit(1);
    }
};

module.exports = connectDB;