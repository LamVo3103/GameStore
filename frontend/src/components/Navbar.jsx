import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm}`);
            setSearchTerm(''); 
        }
    };

    const totalItemsInCart = cartItems.length;

    return (
        <nav className="navbar">
            
            {/* --- 1. NHÓM BÊN TRÁI --- */}
            <div className="nav-left">
                <Link to="/" className="nav-logo">NOXORA</Link>
                <Link to="/about" className="nav-link">Giới thiệu</Link>
            </div>
            
            {/* --- 2. NHÓM Ở GIỮA (Search) --- */}
            <div className="nav-center">
                <form onSubmit={handleSearchSubmit} className="nav-search-form">
                    <input
                        type="text"
                        placeholder="Tìm kiếm game..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="nav-search-input"
                    />
                </form>
            </div>

            {/* --- 3. NHÓM BÊN PHẢI (Actions: Cart & Auth) --- */}
            <div className="nav-right">
                <Link to="/cart" className="nav-link cart-link">
                    Giỏ hàng ({totalItemsInCart})
                </Link>
                
                <div className="nav-separator"></div>

                {user ? (
                    // --- NẾU ĐÃ ĐĂNG NHẬP ---
                    <>
                        {/* --- MENU ADMIN DROPDOWN (ĐÃ SỬA) --- */}
                        {user.role === 'admin' && (
                            <div 
                                className="nav-dropdown"
                                onMouseEnter={() => setAdminDropdownOpen(true)}
                                onMouseLeave={() => setAdminDropdownOpen(false)}
                            >
                                <button className="nav-link admin-link">
                                    Admin Panel
                                </button>
                                {isAdminDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <Link to="/admin/games">Quản lý Game</Link>
                                        {/* Link "Quản lý Tin tức" đã bị xóa */}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <Link to="/my-orders" className="nav-link">
                            Đơn hàng
                        </Link>
                        <span className="nav-welcome">Xin chào, {user.email}!</span>
                        <button onClick={handleLogout} className="nav-button-logout">
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    // --- NẾU CHƯA ĐĂNG NHẬP ---
                    <>
                        <Link to="/register" className="nav-link">Đăng ký</Link>
                        <Link to="/login" className="nav-link">Đăng nhập</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;