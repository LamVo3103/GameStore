const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameCategories = [
    'Hành động', 
    'Phiêu lưu', 
    'Chiến thuật', 
    'Nhập vai (RPG)', 
    'Thể thao', 
    'Mô phỏng'
];

const gameSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }, // Đây là ảnh bìa/ảnh chính
    category: {
        type: String,
        required: true,
        enum: gameCategories,
        default: 'Hành động'
    },
    
    // --- THÊM TRƯỜNG MỚI ---
    galleryImages: {
        type: [String], // Một mảng các chuỗi (URLs)
        default: []     // Mặc định là một mảng rỗng
    }
    // -----------------------

}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = { Game, gameCategories };