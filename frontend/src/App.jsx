import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// Thêm phần mở rộng .jsx cho tất cả các component
import HomePage from './components/HomePage.jsx';
import GameDetailPage from './components/GameDetailPage.jsx';
import EditGamePage from './components/EditGamePage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import CartPage from './components/CartPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import MyOrdersPage from './components/MyOrdersPage.jsx'; 
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import ManageGamesPage from './components/ManageGamesPage.jsx'; 

import './App.css'; 

function App() {
  return (
    <>
      <div style={{ minHeight: 'calc(100vh - 80px)' }}> 
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        
        <Navbar /> 
        
        <Routes>
          {/* Routes cho người dùng */}
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />

          {/* Routes cho Đăng nhập/Đăng ký */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Routes cho Admin */}
          <Route path="/game/edit/:id" element={<EditGamePage />} />
          {/* <Route path="/admin/news" element={<ManageNewsPage />} /> (ĐÃ XÓA) */}
          <Route path="/admin/games" element={<ManageGamesPage />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default App;