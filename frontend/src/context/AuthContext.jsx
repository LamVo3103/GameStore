import { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo "ngăn" Context
const AuthContext = createContext(null);

// 2. Tạo "Nhà cung cấp" (Provider) - chính là "Cái Ví"
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // 3. Khi app vừa tải, kiểm tra xem có token trong LocalStorage không
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser)); // User được lưu dạng JSON string
        }
    }, []);

    // 4. Hàm để Đăng nhập (cất vào ví)
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        // Lưu vào LocalStorage để khi F5 không bị mất
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 5. Hàm để Đăng xuất (xóa khỏi ví)
    const logout = () => {
        setToken(null);
        setUser(null);
        // Xóa khỏi LocalStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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