// backend/routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Để tạo token
let User = require('../models/user.model'); // Import User model

// --- API 1: ĐĂNG KÝ (REGISTER) ---
// (Code gốc của bạn)
router.route('/register').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json('Vui lòng nhập đầy đủ email và mật khẩu.');
        }
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json('Email này đã được đăng ký.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        res.json('Đăng ký tài khoản thành công!');

    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- API 2: ĐĂNG NHẬP (LOGIN) ---
// (Code gốc của bạn)
router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json('Vui lòng nhập đầy đủ email và mật khẩu.');
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json('Email hoặc mật khẩu không đúng.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json('Email hoặc mật khẩu không đúng.');
        }
        const payload = {
            id: user._id,
            email: user.email
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: { 
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- CÁC API MỚI CHO WISHLIST ---

// --- API 3: TOGGLE WISHLIST (Thêm/Xóa) ---
// POST /api/users/wishlist/toggle
router.route('/wishlist/toggle').post(async (req, res) => {
    const { userId, gameId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json('Không tìm thấy user.');

        const index = user.wishlist.indexOf(gameId);
        
        if (index > -1) {
            // Đã có -> Xóa đi ($pull)
            user.wishlist.pull(gameId);
            await user.save();
            res.json({ message: 'Đã xóa khỏi wishlist', action: 'removed' });
        } else {
            // Chưa có -> Thêm vào ($push)
            user.wishlist.push(gameId);
            await user.save();
            res.json({ message: 'Đã thêm vào wishlist', action: 'added' });
        }
    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- API 4: LẤY WISHLIST (CHỈ LẤY ID) ---
// GET /api/users/wishlist/ids/:userId
router.route('/wishlist/ids/:userId').get(async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('wishlist');
        if (!user) return res.status(404).json('Không tìm thấy user.');
        res.json(user.wishlist); // Trả về mảng các ID
    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});

// --- API 5: LẤY WISHLIST (FULL DATA) ---
// GET /api/users/wishlist/full/:userId
router.route('/wishlist/full/:userId').get(async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
                              .populate('wishlist'); // <-- Tự động join với bảng Game
        if (!user) return res.status(404).json('Không tìm thấy user.');
        res.json(user.wishlist); // Trả về mảng các object Game
    } catch (err) {
        res.status(500).json('Lỗi server: ' + err);
    }
});
// ---------------------------------

module.exports = router;