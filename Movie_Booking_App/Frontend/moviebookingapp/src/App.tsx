import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from './components/pages/NavBar';
import LoginSignup from './components/pages/LoginSignup';
import MoviesPage from './components/pages/MoviesPage';
import WatchlistPage from './components/pages/WatchList';
import BookingPage from './components/pages/BookingPage';
import OrdersPage from './components/pages/OrdersPage';
import ManageMovies from './components/pages/ManageMovies';
import FavoritesPage from './components/pages/FavoritesPage';
import AdminDashBoard from './components/pages/AdminDashBoard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
  
      setIsLoggedIn(true);
      setUserRole(userData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
  
      
      if (userData.userId) {
        localStorage.setItem('userId', userData.userId);
      } else {
        localStorage.removeItem('userId'); 
      }
    } else {
      setIsLoggedIn(false);
      setUserRole('');
      localStorage.removeItem('userId'); 
    }
  }, []);
  
  

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} userRole={userRole} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/booking" element={<BookingPage />} /> 
        <Route path='/favorite' element={<FavoritesPage/>}/>
        <Route path="/managemovies" element={<ManageMovies/>}/>
        <Route path="/admindash" element={<AdminDashBoard/>}/>
        <Route path="/login" element={<LoginSignup setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
      </Routes>
    </Router>
  );
};

export default App;
