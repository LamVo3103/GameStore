const router = require('express').Router();
const Review = require('../models/review.model');
const { Game } = require('../models/game.model');
// (Bạn sẽ cần một middleware 'auth' để lấy req.user.id từ token)

// === HÀM TRỢ GIÚP: Cập nhật rating cho Game ===
// Sẽ được gọi sau khi Thêm hoặc Xóa review
async function updateGameRating(gameId) {
    try {
        const reviews = await Review.find({ game: gameId });
        const numReviews = reviews.length;

        if (numReviews === 0) {
            await Game.findByIdAndUpdate(gameId, { averageRating: 0, numReviews: 0 });
            return;
        }

        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const average = totalRating / numReviews;

        await Game.findByIdAndUpdate(gameId, {
            averageRating: average,
            numReviews: numReviews
        });
    } catch (err) {
        console.error("Lỗi cập nhật rating:", err);
    }
}

// --- API 1: Lấy tất cả review của 1 game ---
// GET /api/reviews/:gameId
router.route('/:gameId').get(async (req, res) => {
    try {
        const reviews = await Review.find({ game: req.params.gameId })
                                  .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// --- API 2: Thêm review mới (Cần user đăng nhập) ---
// POST /api/reviews/add
router.route('/add').post(async (req, res) => {
    // Giả sử bạn có middleware auth, lấy user ID từ req.user.id
    const { userId, userEmail, gameId, rating, comment } = req.body;

    // (Thêm logic kiểm tra xem user này đã review game này chưa)
    
    try {
        const newReview = new Review({
            user: userId,
            userEmail: userEmail,
            game: gameId,
            rating: Number(rating),
            comment: comment
        });
        await newReview.save();
        
        // Cập nhật lại rating của Game
        await updateGameRating(gameId); 
        
        res.json('Thêm review thành công!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// --- API 3: Xóa review (Chỉ user tự xóa) ---
// DELETE /api/reviews/:reviewId
router.route('/:reviewId').delete(async (req, res) => {
    // Giả sử bạn có middleware auth, lấy user ID từ req.user.id
    const loggedInUserId = req.body.userId; // (Hoặc lấy từ req.user.id)
    
    try {
        const review = await Review.findById(req.params.reviewId);
        
        if (!review) {
            return res.status(404).json('Không tìm thấy review.');
        }

        // YÊU CẦU: Chỉ chủ sở hữu mới được xóa
        if (review.user.toString() !== loggedInUserId) {
            return res.status(401).json('Bạn không có quyền xóa review này.');
        }

        // Lấy gameId TRƯỚC KHI XÓA
        const gameId = review.game; 
        
        await review.remove(); // Xóa review
        
        // Cập nhật lại rating của Game
        await updateGameRating(gameId); 
        
        res.json('Đã xóa review.');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;