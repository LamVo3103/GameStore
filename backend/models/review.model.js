const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    // 1. Tham chiếu đến Game
    game: { 
        type: Schema.Types.ObjectId, 
        ref: 'Game', 
        required: true 
    },
    // 2. Tham chiếu đến User (để biết ai đã viết)
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // 3. Email (để hiển thị tên cho tiện)
    userEmail: { 
        type: String, 
        required: true 
    },
    // 4. Điểm số (1-5 sao)
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    // 5. Nội dung bình luận
    comment: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true // Tự động thêm createdAt
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;