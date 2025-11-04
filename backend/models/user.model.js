// backend/models/user.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
        default: 'user'       // Mặc định ai đăng ký cũng là 'user'
    },
    // --- THÊM TRƯỜNG MỚI ---
    wishlist: {
        type: [Schema.Types.ObjectId], // Một mảng các ID
        ref: 'Game', // Tham chiếu đến model 'Game'
        default: []
    }
    // -----------------------
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;