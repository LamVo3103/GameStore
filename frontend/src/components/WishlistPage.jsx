// frontend/src/components/WishlistPage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

function WishlistPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    const { addToCart } = useCart();
    const { toggleWishlist } = useWishlist();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                // Gọi API 5 (lấy full data)
                const res = await axios.get(`http://127.0.0.1:5001/api/users/wishlist/full/${user.id}`);
                setGames(res.data);
            } catch (error) {
                console.error("Lỗi tải full wishlist:", error);
                setGames([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [user]); // Chỉ cần tải lại khi user thay đổi

    // Các hàm xử lý nút bấm (giống HomePage)
    const handleAddToCart = (e, game) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        addToCart(game);
        toast.success(`${game.name} đã được thêm vào giỏ!`);
    };

    const handleToggleWishlist = (e, game) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(user.id, game);
        // Cập nhật lại danh sách game trên trang này sau khi xóa
        setGames(prevGames => prevGames.filter(g => g._id !== game._id));
    };

    if (loading) return <div className="page-container">Đang tải...</div>;
    if (!user) return <div className="page-container">Vui lòng <Link to="/login" style={{ color: '#66c0f4' }}>đăng nhập</Link> để xem danh sách yêu thích.</div>;

    return (
        <div className="page-container">
            <h2>Sản phẩm yêu thích ({games.length})</h2>
            {games.length === 0 ? (
                <p>Danh sách yêu thích của bạn đang trống. Hãy thêm game vào nhé!</p>
            ) : (
                <div className="game-list">
                    {/* Tái sử dụng layout của HomePage */}
                    {games.map((game, index) => (
                        <div 
                            key={game._id} 
                            className="game-card animate-fade-in-up" 
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Nút Wishlist (luôn active trên trang này) */}
                            <button
                                className={`wishlist-btn active`}
                                onClick={(e) => handleToggleWishlist(e, game)}
                                title="Xóa khỏi yêu thích"
                            >
                                ❤️
                            </button>

                            <Link to={`/game/${game._id}`} className="game-card-link">
                                <img src={game.imageUrl} alt={game.name} />
                                
                                <div className="game-card-info">
                                    <h3>{game.name}</h3>

                                    <div className="game-card-bottom">
                                        {/* Cột 1: Giá và Thể loại */}
                                        <div className="game-card-details">
                                            <p className="game-price">${game.price}</p>
                                            <span className="game-card-category">{game.category}</span>
                                        </div>

                                        {/* Cột 2: Nút bấm */}
                                        <button 
                                            className="home-add-to-cart-btn"
                                            onClick={(e) => handleAddToCart(e, game)}
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                    
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default WishlistPage;