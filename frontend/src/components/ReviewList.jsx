// frontend/src/components/ReviewList.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from './StarRating'; // (Import file 4)

function ReviewList({ reviews, loading, onReviewDeleted }) {
    const { user } = useAuth(); // Lấy user hiện tại từ Context

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            return;
        }
        
        // Cần phải có user.id để gửi đi xác thực
        if (!user || !user.id) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        try {
            // Gửi userId trong body để backend xác thực
            await axios.delete(`http://127.0.0.1:5001/api/reviews/${reviewId}`, {
                data: { userId: user.id } 
            });
            toast.success('Đã xóa đánh giá.');
            onReviewDeleted(); // Kích hoạt tải lại trên GameDetailPage
        } catch (error) {
            console.error("Lỗi khi xóa review:", error);
            toast.error(error.response?.data || 'Không thể xóa đánh giá.');
        }
    };

    if (loading) {
        return <p>Đang tải đánh giá...</p>;
    }

    if (reviews.length === 0) {
        return <p>Chưa có đánh giá nào cho game này.</p>;
    }

    // Sử dụng CSS .review-list bạn đã có [cite: 2265-2300]
    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review._id} className="review-card">
                    {/* Tên người review */}
                    <h3>{review.userEmail}</h3> 
                    
                    {/* Hiển thị sao */}
                    <div className="star-display" style={{ marginBottom: '1rem' }}>
                        <StarRating rating={review.rating} />
                    </div>

                    {/* Bình luận */}
                    <p className="review-comment">{review.comment}</p>
                    
                    {/* Ngày tháng */}
                    <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                        })}
                    </span>

                    {/* --- PHẦN ĐÃ SỬA LỖI CÚ PHÁP ---
                      Lỗi [cite_start]và comment đã được xóa khỏi thuộc tính.
                    */}
                    {user && user.id === review.user && (
                        <button 
                            className="delete-button-news" // Tận dụng CSS [cite: 2169-2184]
                            onClick={() => handleDelete(review._id)}
                            style={{ marginTop: '1rem', float: 'right' }}
                        >
                            Xóa
                        </button>
                    )}
                    {/* ---------------------------------- */}
                </div>
            ))}
        </div>
    );
}

export default ReviewList;