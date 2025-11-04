// frontend/src/context/WishlistContext.jsx

import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function useWishlist() {
    return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
    // Dùng Set để lưu ID, giúp kiểm tra (isWishlisted) cực nhanh
    const [wishlistIds, setWishlistIds] = useState(new Set());

    // Hàm tải danh sách ID về khi đăng nhập
    const fetchWishlistIds = async (userId) => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://127.0.0.1:5001/api/users/wishlist/ids/${userId}`);
            setWishlistIds(new Set(res.data));
        } catch (error) {
            console.error("Lỗi tải wishlist IDs:", error);
            setWishlistIds(new Set()); // Đặt lại nếu lỗi
        }
    };

    // Hàm Thêm/Xóa
    const toggleWishlist = async (userId, game) => {
        if (!userId || !game) {
            toast.error("Vui lòng đăng nhập!");
            return;
        }

        const gameId = game._id;

        // Cập nhật giao diện ngay lập tức (Optimistic Update)
        const newWishlistIds = new Set(wishlistIds);
        let action; 

        if (newWishlistIds.has(gameId)) {
            newWishlistIds.delete(gameId);
            action = 'removed';
        } else {
            newWishlistIds.add(gameId);
            action = 'added';
        }
        setWishlistIds(newWishlistIds);

        // Gửi yêu cầu lên server
        try {
            const res = await axios.post('http://127.0.0.1:5001/api/users/wishlist/toggle', { userId, gameId });
            
            if (res.data.action === 'added') {
                toast.success(`${game.name} đã được thêm vào yêu thích!`);
            } else {
                toast.error(`${game.name} đã xóa khỏi yêu thích.`);
            }
        } catch (error) {
            console.error("Lỗi toggle wishlist:", error);
            // Nếu lỗi, rollback lại state
            const rollBackIds = new Set(wishlistIds);
            if (action === 'added') rollBackIds.delete(gameId);
            else rollBackIds.add(gameId);
            setWishlistIds(rollBackIds);
            
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    // Hàm kiểm tra 1 game có trong list không
    const isWishlisted = (gameId) => {
        return wishlistIds.has(gameId);
    };

    // Hàm xóa toàn bộ khi logout
    const clearWishlist = () => {
        setWishlistIds(new Set());
    };

    const value = {
        wishlistIds,
        fetchWishlistIds,
        toggleWishlist,
        isWishlisted,
        clearWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}