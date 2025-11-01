import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <Link to="/" className="nav-logo">GameStore</Link>
                    <p>&copy; 2024. Một sản phẩm MERN Stack.</p>
                </div>
                <div className="footer-links">
                    <h4>Khám phá</h4>
                    <Link to="/">Trang chủ</Link>
                    <Link to="/cart">Giỏ hàng</Link>
                    <Link to="/about">Giới thiệu</Link>
                </div>
                <div className="footer-links">
                    <h4>Mạng xã hội</h4>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;