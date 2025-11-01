// backend/routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Để tạo token
let User = require('../models/user.model'); // Import User model

// --- API 1: ĐĂNG KÝ (REGISTER) ---
// Đường dẫn: /api/users/register
router.route('/register').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra input
        if (!email || !password) {
            return res.status(400).json('Vui lòng nhập đầy đủ email và mật khẩu.');
        }

        // 2. Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json('Email này đã được đăng ký.');
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10); // Tạo "muối"
        const hashedPassword = await bcrypt.hash(password, salt); // "Băm" mật khẩu

        // 4. Tạo user mới
        const newUser = new User({
            email: email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
        });

        // 5. Lưu user vào database
        await newUser.save();
        res.json('Đăng ký tài khoản thành công!');

    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- API 2: ĐĂNG NHẬP (LOGIN) ---
// Đường dẫn: /api/users/login
router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra input
        if (!email || !password) {
            return res.status(400).json('Vui lòng nhập đầy đủ email và mật khẩu.');
        }

        // 2. Tìm user trong database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json('Email hoặc mật khẩu không đúng.');
        }

        // 3. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json('Email hoặc mật khẩu không đúng.');
        }

        // 4. TẠO TOKEN (VÉ VÀO CỬA)
        const payload = {
            id: user._id,
            email: user.email
        };
        
        // Hãy chắc chắn bạn đã thêm JWT_SECRET vào file .env
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        // 5. Gửi token về cho frontend
        res.json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: { 
                id: user._id,
                email: user.email,
                role: user.role // <-- THÊM DÒNG NÀY
            }
        });

    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

module.exports = router;