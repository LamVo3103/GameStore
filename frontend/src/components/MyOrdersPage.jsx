import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://127.0.0.1:5001/api/orders/my-orders/${user.id}`);
                    setOrders(response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]); 

    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return <div className="page-container">Đang tải lịch sử đơn hàng...</div>;
    }

    if (!user) {
        return <div className="page-container">Vui lòng <Link to="/login">đăng nhập</Link> để xem lịch sử đơn hàng.</div>;
    }

    return (
        <div className="page-container">
            <h1>Lịch sử Đơn hàng</h1>
            
            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h3>Đơn hàng #{order._id.substring(0, 8)}...</h3>
                                <p>Ngày đặt: {formatDate(order.createdAt)}</p>
                                <strong>Tổng cộng: ${order.totalPrice.toFixed(2)}</strong>
                            </div>
                            <div className="order-items">
                                <h4>Các game đã mua:</h4>
                                {order.items.map(item => (
                                    <div key={item._id} className="order-item">
                                        <img src={item.imageUrl} alt={item.name} />
                                        <Link to={`/game/${item._id}`}>{item.name}</Link>
                                        <span>${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;