import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // <-- SỬA LỖI: Thêm .jsx
import { gameCategories } from '../categories.js'; // <-- SỬA LỖI: Thêm .js

function HomePage() {
    // === STATE ===
    const [games, setGames] = useState([]); // Phải là mảng rỗng
    const [loadingGames, setLoadingGames] = useState(true); 
    const [filterCategory, setFilterCategory] = useState('Tất cả');
    
    // State cho Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // === FUNCTIONS ===

    // 1. Lấy game (Đã sửa để hiểu Phân trang)
    const fetchGames = async () => {
        setLoadingGames(true);
        const currentSearchTerm = searchParams.get('search') || ''; 
        try {
            const response = await axios.get('http://127.0.0.1:5001/api/games', {
                params: { 
                    category: filterCategory,
                    search: currentSearchTerm,
                    page: currentPage 
                }
            });
            // --- ĐÂY LÀ CHỖ SỬA ---
            setGames(response.data.games); // Lấy danh sách TỪ VẬT THỂ
            setTotalPages(response.data.totalPages); 

        } catch (error) {
            console.error("Có lỗi khi lấy dữ liệu game!", error);
            setGames([]); // Nếu lỗi, đặt là mảng rỗng
        } finally {
            setLoadingGames(false); 
        }
    };

    // 2. useEffect TẢI GAME
    useEffect(() => {
        fetchGames();
    }, [filterCategory, searchParams, currentPage]);

    // 3. useEffect TÁI TẠO (Reset về Trang 1 khi Lọc/Search)
    useEffect(() => {
        setCurrentPage(1); 
    }, [filterCategory, searchParams]);

    // 4. HÀM ĐỂ VẼ CÁC NÚT BẤM PHÂN TRANG
    const renderPaginationButtons = () => {
        if (totalPages <= 1) return null;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div className="pagination-container">
                {pages.map(pageNumber => (
                    <button
                        key={pageNumber}
                        className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        );
    };

    // === RENDER GIAO DIỆN ===
    return (
        <div className="page-container">
            <h2>Danh sách Game</h2>

            {/* Thanh Lọc */}
            <div className="search-and-filter-container">
                <div className="category-filter">
                    <button 
                        className={filterCategory === 'Tất cả' ? 'active' : ''}
                        onClick={() => setFilterCategory('Tất cả')}
                    >
                        Tất cả
                    </button>
                    {gameCategories.map(cat => (
                        <button 
                            key={cat}
                            className={filterCategory === cat ? 'active' : ''}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Danh sách game */}
            {loadingGames ? (
                <div>Đang tải danh sách game...</div>
            ) : games.length === 0 ? (
                <p>Không tìm thấy game nào phù hợp.</p>
            ) : (
                <>
                    <div className="game-list">
                        {games.map((game, index) => (
                            <div 
                                key={game._id} 
                                className="game-card animate-fade-in-up" 
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link to={`/game/${game._id}`} className="game-card-link">
                                    <img src={game.imageUrl} alt={game.name} />
                                    <div className="game-card-info">
                                        <h3>{game.name}</h3>
                                        <p className="game-price">${game.price}</p>
                                        <span className="game-card-category">{game.category}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    {/* Thêm nút Phân trang */}
                    {renderPaginationButtons()}
                </>
            )}
        </div>
    );
}

export default HomePage;

