import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios'; 
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom'; 

function CartPage() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth(); 
    const navigate = useNavigate();

    const handleRemove = (gameId, gameName) => {
        removeFromCart(gameId);
        toast.error(`${gameName} đã được xóa khỏi giỏ!`);
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thanh toán!');
            navigate('/login'); 
            return;
        }

        const orderData = {
            userId: user.id,
            userEmail: user.email,
            items: cartItems, 
            totalPrice: totalPrice
        };

        try {
            await axios.post('http://127.0.0.1:5001/api/orders/add', orderData);
            
            toast.success('Đặt hàng thành công! Cảm ơn bạn.');
            clearCart(); 
            navigate('/'); 

        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error('Có lỗi xảy ra khi đặt hàng.');
        }
    };

    return (
        <div className="page-container">
            <h1>Giỏ hàng của bạn</h1>
            
            {cartItems.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống. <Link to="/" className="nav-link">Quay lại mua sắm</Link></p>
            ) : (
                <div className="cart-container">
                    
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <Link to={`/game/${item._id}`}>
                                        <h3>{item.name}</h3>
                                    </Link>
                                    <p>${item.price.toFixed(2)}</p>
                                </div>
                                <button 
                                    className="cart-remove-button"
                                    onClick={() => handleRemove(item._id, item.name)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Phần tổng kết (summary) */}
                    <div className="cart-summary">
                        <h2>Tổng kết đơn hàng</h2>
                        <div className="summary-row">
                            <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Thuế (Tạm tính):</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-total">
                            <span>Tổng cộng:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            className="checkout-button"
                            onClick={handleCheckout} 
                        >
                            Tiến hành Thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
