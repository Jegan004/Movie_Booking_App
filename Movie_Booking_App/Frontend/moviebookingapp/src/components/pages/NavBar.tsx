import React, { useState } from 'react';
import { NavbarContainer, NavbarLink, LogoContainer, NavbarMenu, MenuToggle } from '../styles/NavBar';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  isLoggedIn: boolean;
  userRole: string;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUserRole: (role: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, userRole, setIsLoggedIn, setUserRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole'); 
    setIsLoggedIn(false);
    setUserRole(''); 
    navigate('/login'); 
  };

  return (
    <NavbarContainer>
      <LogoContainer data-testid="logo">
        <h1>MovieApp</h1>
      </LogoContainer>
      <NavbarMenu $isMenuOpen={isMenuOpen} data-testid="navbar-menu">
        <NavbarLink to="/movies" data-testid="/movies">Movies</NavbarLink>

        {isLoggedIn ? (
          userRole === 'Admin' ? (
            <>
            <NavbarLink to="/managemovies" data-testid="/managemovies">Add Movies</NavbarLink>
            <NavbarLink to="/admindash" >DashBoard</NavbarLink>
            </>
          ) : (
            <>
              <NavbarLink to="/orders" data-testid="/orders">Bookings</NavbarLink>
              <NavbarLink to="/watchlist" data-testid="/watchlist">Watchlists</NavbarLink>
              <NavbarLink to="/favorite" data-testid="/favorite">Favorites</NavbarLink>
            </>
          )
        ) : (
          <NavbarLink to="/login" data-testid="/login">Login</NavbarLink>
        )}

        {isLoggedIn && (
          <span onClick={handleLogout} style={{ cursor: 'pointer', padding: '10px', color: 'white' }}>
            Logout
          </span>
        )}
      </NavbarMenu>
      <MenuToggle onClick={handleMenuToggle} data-testid="menu-toggle">
        <div />
        <div />
        <div/>
      </MenuToggle>
    </NavbarContainer>
  );
};

export default NavBar;
