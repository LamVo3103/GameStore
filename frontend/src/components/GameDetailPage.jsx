import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function GameDetailPage() {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null); 
    const [relatedGames, setRelatedGames] = useState([]);
    
    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();

    // useEffect 1: Tải game chính (Đã sửa IP)
    useEffect(() => {
        const fetchGame = async () => {
            setLoading(true); 
            setGame(null); 
            setRelatedGames([]);
            try {
                // API này (lấy 1 game) trả về 1 game, không phải object
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

    // useEffect 2: Tải game liên quan (Sửa IP và Lỗi Phân trang)
    useEffect(() => {
        if (game && game.category) { 
            const fetchRelatedGames = async () => {
                try {
                    // API /api/games trả về { games: [...] }
                    const response = await axios.get('http://127.0.0.1:5001/api/games', {
                        params: { category: game.category }
                    });
                    
                    // --- ĐÂY LÀ CHỖ SỬA ---
                    const related = response.data.games // Lấy TỪ VẬT THỂ
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

    // Hàm Thêm vào giỏ
    const handleAddToCart = () => {
        if (!game) return;
        addToCart(game);
        toast.success(`${game.name} đã được thêm vào giỏ!`);
    };

    if (loading) { return <div className="page-container">Đang tải...</div>; }
    if (!game) { return <div className="page-container">Không tìm thấy game.</div>; }

    // Xử lý logic ảnh
    const gallery = game.galleryImages || []; 
    const allImages = [...new Set([game.imageUrl, ...gallery])].filter(Boolean);

    return (
        <div className="page-container"> 
            <div className="game-detail-container">
                
                {/* Cột 1: Ảnh */}
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

                {/* Cột 2: Thông tin */}
                <div className="game-detail-info animate-slide-in-right">
                    <h1>{game.name}</h1>
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

            {/* Phần 2: Game liên quan */}
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
        </div> 
    );
}

export default GameDetailPage;
