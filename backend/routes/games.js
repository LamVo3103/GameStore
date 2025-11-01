const router = require('express').Router();
const { Game } = require('../models/game.model'); 

// --- API 1: LẤY GAME (NÂNG CẤP VỚI PHÂN TRANG) ---
router.route('/').get(async (req, res) => {
    try {
        const { category, search, page } = req.query; // Thêm 'page'

        const limit = 9; // 9 sản phẩm mỗi trang
        const currentPage = Number(page) || 1; // Trang hiện tại, mặc định là 1
        const skip = (currentPage - 1) * limit; // Bỏ qua bao nhiêu sản phẩm

        let filter = {}; // Bộ lọc

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
        // Đếm tổng số game KHỚP VỚI BỘ LỌC
        const totalGames = await Game.countDocuments(filter);

        // 4. Lấy game CỦA TRANG HIỆN TẠI
        const games = await Game.find(filter)
            .sort({ createdAt: -1 }) // Sắp xếp game mới lên đầu
            .limit(limit) // Giới hạn 9 game
            .skip(skip);  // Bỏ qua các trang trước

        // 5. Trả về cả 2
        res.json({
            games: games, // Danh sách game của trang này
            totalPages: Math.ceil(totalGames / limit) // Tổng số trang
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