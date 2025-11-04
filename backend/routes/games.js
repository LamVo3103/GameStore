// backend/routes/games.js

const router = require('express').Router();
const { Game } = require('../models/game.model');

// --- API 1: LẤY GAME (ĐÃ SỬA LỖI PHÂN TRANG) ---
router.route('/').get(async (req, res) => {
    try {
        // 1. Đọc 'limit' và 'page' từ query
        const { category, search, page, limit } = req.query; 

        // 2. Nếu 'limit' được cung cấp (ví dụ: 1000), thì dùng nó. Nếu không, mặc định là 9.
        const pageLimit = Number(limit) || 9; 
        
        const currentPage = Number(page) || 1; 
        const skip = (currentPage - 1) * pageLimit; // 3. Dùng pageLimit

        let filter = {}; 

        // 1. Lọc theo Category
        if (category && category !== 'Tất cả') {
            filter.category = category;
        }
        // 2. Lọc theo Search
        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            };
        }

        // 3. Lấy TỔNG SỐ game (để tính số trang)
        const totalGames = await Game.countDocuments(filter);
        
        // 4. Lấy game CỦA TRANG HIỆN TẠI
        const games = await Game.find(filter)
            .sort({ createdAt: -1 }) 
            .limit(pageLimit) // 4. Dùng pageLimit
            .skip(skip);

        // 5. Trả về
        res.json({
            games: games, 
            totalPages: Math.ceil(totalGames / pageLimit) // 5. Dùng pageLimit
        });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// --- API 2: THÊM GAME (Giữ nguyên) ---
router.route('/add').post(async (req, res) => {
    try {
        const { name, description, price, imageUrl, category, galleryImages } = req.body;
        const newGame = new Game({ name, description, price, imageUrl, category, galleryImages });
        await newGame.save();
        res.json('Game added!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// --- API 3: LẤY CHI TIẾT 1 GAME (Giữ nguyên) ---
router.route('/:id').get((req, res) => {
    Game.findById(req.params.id)
        .then(game => res.json(game))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- API 4: XÓA GAME (Giữ nguyên) ---
router.route('/:id').delete((req, res) => {
    Game.findByIdAndDelete(req.params.id)
        .then(() => res.json('Game deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- API 5: CẬP NHẬT GAME (Giữ nguyên) ---
router.route('/:id').put((req, res) => {
    Game.findById(req.params.id)
        .then(game => {
            if (!game) { return res.status(404).json('Không tìm thấy game.'); }
            game.name = req.body.name;
            game.description = req.body.description;
            game.price = Number(req.body.price);
            game.imageUrl = req.body.imageUrl;
            game.category = req.body.category;
            game.galleryImages = req.body.galleryImages;
            game.save()
                .then(() => res.json('Game đã được cập nhật!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;