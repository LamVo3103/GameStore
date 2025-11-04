// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useWishlist } from './WishlistContext'; // <-- 1. THÊM DÒNG NÀY

// 1. Tạo "ngăn" Context
const AuthContext = createContext(null);

// 2. Tạo "Nhà cung cấp" (Provider) - chính là "Cái Ví"
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const { fetchWishlistIds, clearWishlist } = useWishlist(); // <-- 2. THÊM DÒNG NÀY

    // 3. Khi app vừa tải, kiểm tra xem có token trong LocalStorage không
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            const userData = JSON.parse(storedUser); // User được lưu dạng JSON string
            setToken(storedToken);
            setUser(userData);
            fetchWishlistIds(userData.id); // <-- 3. THÊM DÒNG NÀY (Tải wishlist nếu F5)
        }
    }, []); // Chỉ chạy 1 lần khi app tải

    // 4. Hàm để Đăng nhập (cất vào ví)
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        // Lưu vào LocalStorage để khi F5 không bị mất
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        fetchWishlistIds(userData.id); // <-- 4. THÊM DÒNG NÀY (Tải wishlist khi đăng nhập)
    };

    // 5. Hàm để Đăng xuất (xóa khỏi ví)
    const logout = () => {
        setToken(null);
        setUser(null);
        // Xóa khỏi LocalStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearWishlist(); // <-- 5. THÊM DÒNG NÀY (Xóa wishlist khỏi state)
    };

    // 6. Cung cấp "ví" cho các component con
    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 7. Tạo một hook (móc) tùy chỉnh để dễ dàng "sử dụng ví"
export const useAuth = () => {
    return useContext(AuthContext);
};