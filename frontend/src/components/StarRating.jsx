// frontend/src/components/StarRating.jsx

import React from 'react';

// Component này chỉ để hiển thị, không tương tác
function StarRating({ rating }) {
    const stars = [];
    
    // Làm tròn đến 0.5 gần nhất
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            // Sao vàng (đầy)
            stars.push(<span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>);
        } else if (i === fullStars + 1 && hasHalfStar) {
            // Sao nửa (dùng CSS nếu có, ở đây dùng ký tự)
             stars.push(<span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>); // Tạm thời vẫn dùng sao đầy cho đơn giản
        } else {
            // Sao xám (trống)
            stars.push(<span key={i} style={{ color: '#e4e5e9', fontSize: '1.2rem' }}>☆</span>);
        }
    }
    // Đơn giản hóa: Làm tròn đến số nguyên gần nhất
    const simpleRoundedRating = Math.round(rating);
    const simpleStars = [];
     for (let i = 1; i <= 5; i++) {
        if (i <= simpleRoundedRating) {
            simpleStars.push(<span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>);
        } else {
            simpleStars.push(<span key={i} style={{ color: '#e4e5e9', fontSize: '1.2rem' }}>☆</span>);
        }
    }

    return <div>{simpleStars}</div>;
}

export default StarRating;