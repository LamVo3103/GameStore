import React from 'react';

function AboutPage() {
    return (
        // Chúng ta dùng 'page-container' để nó tự căn giữa
        <div className="page-container">
            {/* Thêm animation trượt lên */}
            <div className="about-content animate-fade-in-up">
                <h1>Về NOXORA</h1>
                <p>
                    Chào mừng bạn đến với NOXORA, dự án được xây dựng với niềm đam mê công nghệ MERN Stack (MongoDB, Express, React, Node.js) và tình yêu dành cho game.
                </p>
                <p>
                    Đây là một trang web demo, mô phỏng đầy đủ các chức năng của một nền tảng thương mại điện tử hiện đại, bao gồm:
                </p>
                <ul>
                    <li>Quản lý sản phẩm (CRUD) với vai trò Admin.</li>
                    <li>Xác thực người dùng (Đăng ký/Đăng nhập) sử dụng JWT.</li>
                    <li>Phân quyền (Admin vs User).</li>
                    <li>Tìm kiếm và Phân loại sản phẩm.</li>
                    <li>Hệ thống Giỏ hàng (Shopping Cart).</li>
                    <li>Và nhiều tính năng giao diện "sống động" khác.</li>
                </ul>
                
                <h2>Mục tiêu</h2>
                <p>
                    Mục tiêu của dự án này là thể hiện khả năng xây dựng một ứng dụng web Full-Stack phức tạp, bảo mật và thân thiện với người dùng từ đầu đến cuối.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;