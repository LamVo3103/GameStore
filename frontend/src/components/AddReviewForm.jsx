// frontend/src/components/AddReviewForm.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Sử dụng CSS có sẵn từ App.css (.add-game-form) [cite: 1378-1426]
function AddReviewForm({ gameId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim().length < 10) {
            toast.error('Bình luận phải có ít nhất 10 ký tự.');
            return;
        }
        setIsSubmitting(true);

        const reviewData = {
            gameId: gameId,
            userId: user.id,
            userEmail: user.email,
            rating: Number(rating),
            comment: comment
        };

        try {
            await axios.post('http://127.0.0.1:5001/api/reviews/add', reviewData);
            toast.success('Gửi đánh giá thành công!');
            setComment('');
            setRating(5);
            onReviewAdded(); // Kích hoạt tải lại review trên GameDetailPage
        } catch (error) {
            console.error("Lỗi khi gửi review:", error);
            toast.error(error.response?.data || 'Không thể gửi đánh giá.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tận dụng style .add-game-form của bạn [cite: 1378-1426]
    return (
        <div className="add-game-form" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}> 
            <h3 style={{ marginTop: 0, border: 'none' }}>Để lại đánh giá của bạn</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Điểm số (1-5):</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="5">5 sao (Tuyệt vời)</option>
                        <option value="4">4 sao (Tốt)</option>
                        {/* --- LỖI ĐÃ SỬA --- */}
                        <option value="3">3 sao (Khá)</option> {/* <-- Đã sửa: value="3" */}
                        {/* ----------------- */}
                        <option value="2">2 sao (Tệ)</option>
                        <option value="1">1 sao (Rất tệ)</option>
                    </select>
                </div>
                <div>
                    <label>Bình luận:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Cảm nhận của bạn về game này..."
                        required
                        minLength={10}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>
        </div>
    );
}

export default AddReviewForm;