import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gameCategories } from '../categories'; 
import toast from 'react-hot-toast'; 

function EditGamePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState(gameCategories[0]); 
    const [galleryString, setGalleryString] = useState(''); 
    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu cũ (Đã sửa IP)
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5001/api/games/${id}`);
                const game = response.data;
                setName(game.name);
                setDescription(game.description);
                setPrice(game.price);
                setImageUrl(game.imageUrl);
                setCategory(game.category || gameCategories[0]); 
                setGalleryString(game.galleryImages ? game.galleryImages.join(', ') : '');
            } catch (error) { 
                console.error("Lỗi khi lấy thông tin game:", error);
                toast.error("Không thể tải thông tin game.");
            } 
            finally { setLoading(false); }
        };
        fetchGame();
    }, [id]);

    // 2. Gửi dữ liệu cập nhật (Đã sửa IP)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const galleryImages = galleryString
            .split(',')
            .map(url => url.trim())
            .filter(url => url.length > 0);
            
        const updatedGame = { name, description, price, imageUrl, category, galleryImages }; 
        
        try {
            await axios.put(`http://127.0.0.1:5001/api/games/${id}`, updatedGame);
            toast.success('Cập nhật game thành công!'); 
            navigate(`/game/${id}`); 
        } catch (error) { 
            console.error("Lỗi khi cập nhật game:", error);
            toast.error('Cập nhật thất bại.');
        }
    };

    if (loading) { return <div className="page-container">Đang tải...</div> }

    // 3. Render form
    return (
        <div className="page-container">
            <div className="add-game-form">
                <h2>Chỉnh sửa Game</h2>
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
                    
                    <button type="submit">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
}

export default EditGamePage;
