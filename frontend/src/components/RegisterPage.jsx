import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Thêm 'Link'
import toast from 'react-hot-toast'; // Import toast

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Dùng để chuyển trang

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5001/api/users/register', { 
                email, 
                password 
            });
            
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login'); // Chuyển người dùng sang trang đăng nhập

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            // Bắt lỗi cụ thể từ backend
            const message = error.response?.data || 'Đăng ký thất bại.';
            toast.error(message);
        }
    };

    return (
        // Dùng class mới
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Tạo tài khoản</h2>
                    
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
                    
                    <button type="submit" className="auth-button">Đăng ký</button>;
                    
                    <p className="auth-switch-link">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;