// Import các thư viện
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Để đọc file .env

// Khởi tạo app Express
const app = express();
const PORT = process.env.PORT || 5000; // Cổng server sẽ chạy

// Sử dụng các middleware
app.use(cors()); // Cho phép cors
app.use(express.json()); // Cho phép server đọc JSON từ request

// --- Kết nối MongoDB ---
const uri = process.env.MONGODB_URI;
// Xóa các options cũ không cần thiết
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!");
});

// --- ĐỊNH NGHĨA API ROUTES ---
const gameRouter = require('./routes/games'); // Import file routes/games.js
app.use('/api/games', gameRouter);

// --- CÁC DÒNG BẠN ĐÃ QUÊN ---
const userRouter = require('./routes/users'); // <-- THÊM DÒNG NÀY
app.use('/api/users', userRouter);           // <-- THÊM DÒNG NÀY
// ------------------------------
const orderRouter = require('./routes/orders');
app.use('/api/orders', orderRouter);
// --- Chạy server ---
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port: ${PORT} at http://127.0.0.1:${PORT}`);
});