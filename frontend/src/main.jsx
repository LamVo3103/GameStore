// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // <-- 1. THÊM DÒNG NÀY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* WishlistProvider phải ở ngoài AuthProvider 
        vì AuthProvider cần dùng useWishlist()
      */}
      <WishlistProvider> {/* <-- 2. BỌC Ở ĐÂY */}
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </WishlistProvider> {/* <-- 3. ĐÓNG Ở ĐÂY */}
    </BrowserRouter>
  </React.StrictMode>,
);