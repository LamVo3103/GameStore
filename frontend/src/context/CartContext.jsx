import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (game) => {
        const existingItem = cartItems.find(item => item._id === game._id);
        if (existingItem) {
            console.log("Game này đã có trong giỏ!");
        } else {
            setCartItems(prevItems => [...prevItems, { ...game, quantity: 1 }]);
        }
    };

    const removeFromCart = (gameId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== gameId));
    };

    // --- THÊM HÀM MỚI ---
    const clearCart = () => {
        setCartItems([]); // Set giỏ hàng thành mảng rỗng
        localStorage.removeItem('cart'); // Xóa khỏi Local Storage
    };
    // -------------------

    return (
        <CartContext.Provider 
            // Thêm clearCart vào 'value'
            value={{ cartItems, addToCart, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    return useContext(CartContext);
};