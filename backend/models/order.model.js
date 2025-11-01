const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Đây là một schema con, định nghĩa 1 game trong đơn hàng
const orderItemSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    // Chúng ta không cần lưu tất cả, chỉ lưu những gì cần
});

const orderSchema = new Schema({
    // Lưu ID của user đã mua
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Tham chiếu đến model 'User'
        required: true 
    },
    // Lưu email (để dễ tra cứu)
    userEmail: {
        type: String,
        required: true
    },
    // Một mảng các sản phẩm đã mua
    items: [orderItemSchema], 
    
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;