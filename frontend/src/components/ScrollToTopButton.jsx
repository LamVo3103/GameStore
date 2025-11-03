// frontend/src/components/ScrollToTopButton.jsx

import { useState, useEffect } from 'react';

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Hàm này sẽ kiểm tra vị trí cuộn
    // Nếu cuộn xuống quá 300px, hiện nút. Nếu không, ẩn đi.
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // 2. Hàm này sẽ cuộn trang lên đầu khi nhấn nút
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Thêm hiệu ứng cuộn mượt
        });
    };

    // 3. Sử dụng useEffect để thêm/xóa Event Listener
    useEffect(() => {
        // Thêm listener khi component được mount
        window.addEventListener('scroll', toggleVisibility);

        // Dọn dẹp (xóa) listener khi component bị unmount
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {/* Chỉ hiển thị nút khi isVisible là true */}
            {isVisible && (
                <button onClick={scrollToTop} className="scroll-top-button" title="Lên đầu trang">
                    ↑
                </button>
            )}
        </div>
    );
}

export default ScrollToTopButton;