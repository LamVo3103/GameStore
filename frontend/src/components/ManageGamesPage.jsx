// frontend/src/components/ManageGamesPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { gameCategories } from '../categories'; 

function ManageGamesPage() {
    // === STATE ===
    const [games, setGames] = useState([]); // Phải là mảng rỗng
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    // State cho Form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState(gameCategories[0]); 
    const [galleryString, setGalleryString] = useState(''); 

    // === FUNCTIONS ===

    // 1. Lấy tất cả game
    const fetchGames = async () => {
        setLoading(true);
        try {
            // --- ĐÂY LÀ DÒNG ĐÃ SỬA ---
            // Yêu cầu API trả về 1000 game thay vì 9 game mặc định
            const response = await axios.get('http://127.0.0.1:5001/api/games?limit=1000'); 
            // --------------------------
            
            setGames(response.data.games); // Lấy danh sách TỪ VẬT THỂ
            
        } catch (error) {
            console.error("Có lỗi khi lấy dữ liệu game!", error);
            setGames([]); // Nếu lỗi, đặt là mảng rỗng
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // 2. Hàm Thêm Game (Đã sửa IP)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const galleryImages = galleryString.split(',').map(url => url.trim()).filter(url => url.length > 0);
        const newGame = { name, description, price, imageUrl, category, galleryImages }; 
        try {
            await axios.post('http://127.0.0.1:5001/api/games/add', newGame);
            toast.success('Thêm game thành công!');
            // Reset form
            setName('');
            setDescription('');
            setPrice(0);
            setImageUrl('');
            setCategory(gameCategories[0]);
            setGalleryString(''); 
            fetchGames(); 
        } catch (error) {
            toast.error('Thêm game thất bại.');
        }
    };

    // 3. Hàm Xóa Game (Đã sửa IP)
    const deleteGame = async (gameId) => {
        if (!window.confirm('Bạn có chắc muốn xóa game này?')) return;
        try {
            await axios.delete(`http://127.0.0.1:5001/api/games/${gameId}`);
            toast.success('Xóa game thành công!');
            fetchGames();
        } catch (error) {
            toast.error('Xóa game thất bại.');
        }
    };

    // --- BẢO VỆ ROUTE ---
    if (!user || user.role !== 'admin') {
        toast.error('Bạn không có quyền truy cập trang này!');
        return <Navigate to="/" replace />; 
    }

    // === RENDER ===
    return (
        <div className="page-container">
            <h1>Quản lý Game</h1>
            
            {/* 1. Form Thêm Game */}
            <div className="add-game-form animate-fade-in-up">
                <h2>Thêm Game Mới</h2>
                <form onSubmit={handleSubmit}>
                    <div><label>Tên Game:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                    <div><label>Mô tả:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                    <div><label>Giá ($):</label><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required /></div>
                    <div><label>Link ảnh bìa (imageUrl):</label><input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required /></div>
                    <div><label>Loại game:</label><select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {gameCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select></div>
                    <div>
                        <label>Các ảnh phụ (galleryImages):</label>
                        <input 
                            type="text" 
                            value={galleryString}
                            onChange={(e) => setGalleryString(e.target.value)}
                            placeholder="Dán các link ảnh, cách nhau bằng dấu phẩy..."
                        />
                    </div>
                    <button type="submit">Thêm Game</button>
                </form>
            </div>
            
            <hr />
            
            {/* 2. Danh sách Game (Để Sửa/Xóa) */}
            <h2>Danh sách Game hiện có ({games.length})</h2>
            {loading ? (
                <p>Đang tải danh sách game...</p>
            ) : (
                <div className="manage-game-list">
                    {games.map(game => (
                        <div key={game._id} className="manage-game-card">
                            <img src={game.imageUrl} alt={game.name} />
                            <div className="manage-game-info">
                                <h3>{game.name}</h3>
                                <p>${game.price} - {game.category}</p>
                            </div>
                            <div className="manage-game-actions">
                                <Link to={`/game/edit/${game._id}`} className="edit-button-news">
                                    Sửa
                                </Link>
                                <button className="delete-button-news" onClick={() => deleteGame(game._id)}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageGamesPage;