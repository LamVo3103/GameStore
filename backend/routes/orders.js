const router = require('express').Router();
let Order = require('../models/order.model');

// --- API 1: TẠO ĐƠN HÀNG MỚI (CHECKOUT) ---
// (Bạn đã có code này)
router.route('/add').post(async (req, res) => {
    try {
        const { userId, userEmail, items, totalPrice } = req.body;

        if (!userId || !userEmail || !items || items.length === 0 || !totalPrice) {
            return res.status(400).json('Dữ liệu đơn hàng không hợp lệ.');
        }

        const newOrder = new Order({
            user: userId,
            userEmail: userEmail,
            items: items,
            totalPrice: totalPrice
        });

        await newOrder.save();
        res.status(201).json('Đặt hàng thành công!');

    } catch (err) {
        console.error("Lỗi khi tạo đơn hàng:", err);
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- API 2: LẤY LỊCH SỬ ĐƠN HÀNG CỦA 1 USER ---
// (Code mới)
// GET /api/orders/my-orders/:userId
router.route('/my-orders/:userId').get(async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm tất cả đơn hàng có 'user' ID trùng với userId
        // Sắp xếp .sort({ createdAt: -1 }) để đơn hàng mới nhất lên đầu
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
        res.status(500).json('Lỗi server: ' + err);
    }
});

module.exports = router;