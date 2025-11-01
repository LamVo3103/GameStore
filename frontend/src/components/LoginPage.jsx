import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Thêm 'Link'
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // Import toast (thay vì alert)

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm 'login' từ ví

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5001/api/users/login', { 
                email, 
                password 
            });
            
            const { token, user } = response.data;
            login(token, user); // Cất token và user vào "ví"
            
            toast.success('Đăng nhập thành công!'); // Thông báo đẹp
            navigate('/'); // Chuyển về trang chủ

        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            // Thông báo lỗi đẹp
            toast.error('Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.');
        }
    };

    return (
        // Dùng class mới, không dùng .App hay .add-game-form
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Đăng nhập</h2>
                    
                    <div className="input-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            className="auth-input" // Class mới
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Mật khẩu:</label>
                        <input 
                            type="password" 
                            className="auth-input" // Class mới
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="auth-button">Đăng nhập</button>
                    
                    <p className="auth-switch-link">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;