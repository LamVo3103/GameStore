// frontend/src/components/GameDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// --- CÁC COMPONENT MỚI ---
import AddReviewForm from './AddReviewForm'; // (File 2)
import ReviewList from './ReviewList';       // (File 3)
import StarRating from './StarRating';       // (File 4)
// -------------------------

function GameDetailPage() {
    // State cũ
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [relatedGames, setRelatedGames] = useState([]);
    
    // --- STATE MỚI CHO REVIEW ---
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    // State này dùng để "báo" cho component tải lại review
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    // ----------------------------

    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();

    // === HÀM TẢI LẠI REVIEW ===
    // Sẽ được gọi bởi component con sau khi Thêm/Xóa
    const refreshReviews = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // useEffect 1: Tải game chính (Giữ nguyên code gốc của bạn)
    useEffect(() => {
        const fetchGame = async () => {
            setLoading(true);
            setGame(null);
            setRelatedGames([]);
            try {
                const response = await axios.get(`http://127.0.0.1:5001/api/games/${id}`);
                if (response.data) {
                    setGame(response.data);
                    setMainImage(response.data.imageUrl);
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết game:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    // useEffect 2: Tải game liên quan (Giữ nguyên code gốc của bạn)
    useEffect(() => {
         if (game && game.category) { 
            const fetchRelatedGames = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:5001/api/games', {
                        params: { category: game.category }
                    });
                    const related = response.data.games
                        .filter(g => g._id !== game._id)
                        .slice(0, 4); 
                    setRelatedGames(related);
                } catch (error) {
                    console.error("Lỗi khi lấy game liên quan:", error);
                }
            };
            fetchRelatedGames();
        }
    }, [game]); 

    // --- useEffect 3: Tải review (MỚI) ---
    useEffect(() => {
        if (!id) return; // Không chạy nếu chưa có ID

        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                // API này ta đã thống nhất ở bước trước
                const res = await axios.get(`http://127.0.0.1:5001/api/reviews/${id}`);
                setReviews(res.data);
            } catch (err) {
                console.error("Lỗi tải review", err);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
        // Tải lại khi ID game thay đổi, hoặc khi refreshTrigger thay đổi
    }, [id, refreshTrigger]); 
    // -------------------------------

    // Hàm Thêm vào giỏ (Giữ nguyên)
    const handleAddToCart = () => {
        if (!game) return;
        addToCart(game);
        toast.success(`${game.name} đã được thêm vào giỏ!`);
    };

    if (loading) { return <div className="page-container">Đang tải...</div>; }
    if (!game) { return <div className="page-container">Không tìm thấy game.</div>; }

    const gallery = game.galleryImages || [];
    const allImages = [...new Set([game.imageUrl, ...gallery])].filter(Boolean);

    return (
        <div className="page-container">
            <div className="game-detail-container">
                {/* Cột 1: Ảnh (Giữ nguyên) */}
                <div className="game-detail-image animate-slide-in-left">
                    <img 
                        src={mainImage} 
                        alt="Main view" 
                        className="main-gallery-image"
                    />
                    <div className="thumbnail-gallery">
                        {allImages.map((imgUrl, index) => (
                            <img 
                                key={index}
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setMainImage(imgUrl)}
                                className={mainImage === imgUrl ? 'active' : ''}
                            />
                        ))}
                    </div>
                </div>

                {/* Cột 2: Thông tin (CẬP NHẬT) */}
                <div className="game-detail-info animate-slide-in-right">
                    <h1>{game.name}</h1>
                    
                    {/* --- HIỂN THỊ RATING TRUNG BÌNH --- */}
                    <div className="game-rating-summary" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <StarRating rating={game.averageRating} />
                        <span style={{ color: '#c7d5e0', fontSize: '1.1rem' }}>
                            {game.averageRating ? game.averageRating.toFixed(1) : '0'}/5 
                            ({game.numReviews || 0} đánh giá)
                        </span>
                    </div>
                    {/* ---------------------------------- */}
                    
                    <p className="game-price-detail">${game.price}</p>
                    <p className="game-description-detail">{game.description}</p>
                    <div className="game-detail-actions">
                        <button className="buy-button" onClick={handleAddToCart}>
                            Thêm vào giỏ
                        </button>
                        {user && user.role === 'admin' && (
                            <Link to={`/game/edit/${game._id}`}>
                                <button className="edit-button">Chỉnh sửa (Admin)</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* --- PHẦN 2: GAME LIÊN QUAN (Giữ nguyên) --- */}
            {relatedGames.length > 0 && (
                <div className="related-games-section animate-fade-in-up">
                    <h2>Game liên quan</h2>
                    <div className="related-games-list">
                         {relatedGames.map(relatedGame => (
                            <Link to={`/game/${relatedGame._id}`} key={relatedGame._id} className="related-game-card">
                                <img src={relatedGame.imageUrl} alt={relatedGame.name} />
                                <h3>{relatedGame.name}</h3>
                                <p>${relatedGame.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHẦN 3: ĐÁNH GIÁ & BÌNH LUẬN (MỚI) --- */}
            <div className="reviews-section animate-fade-in-up" style={{ marginTop: '3rem' }}>
                <h2>Đánh giá & Bình luận</h2>
                
                {/* 1. Form thêm review (Chỉ hiện khi đã đăng nhập) */}
                {user ? (
                    <AddReviewForm gameId={game._id} onReviewAdded={refreshReviews} />
                ) : (
                    <p>Vui lòng <Link to="/login" style={{ color: '#66c0f4' }}>đăng nhập</Link> để để lại đánh giá.</p>
                )}

                {/* 2. Danh sách review */}
                <ReviewList 
                    reviews={reviews} 
                    loading={loadingReviews} 
                    onReviewDeleted={refreshReviews} 
                />
            </div>
            {/* ---------------------------------------------- */}
        </div>
    );
}

export default GameDetailPage;