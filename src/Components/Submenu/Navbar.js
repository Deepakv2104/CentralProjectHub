import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/auth-context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/Navbar.css';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon

const Navbar = ({ onMenuToggle }) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const options = user
    ? ['Home', 'student-dashboard', 'Contact', 'About', 'Logout']
    : ['Home', 'Contact', 'About', 'Login'];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/home')
      toast.success('Logout successful!', { position: 'top-center' });
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout. Please try again.', { position: 'top-center' });
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    onMenuToggle(); // Notify the parent component about the menu toggle
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`navbar-container ${menuOpen ? 'menu-open' : ''}`}>
      {/* Text instead of logo with CSS styling */}
      <div className="logo-text">ANURAG UNIVERSITY</div>

      {/* Hamburger Icon for Mobile View */}
      {isMobile && (
        <div className="hamburger-icon" onClick={handleMenuToggle}>
          <MenuIcon />
        </div>
      )}

      <div className={`nav-options ${menuOpen ? 'open' : ''}`}>
        {options.map((option, index) => (
          <div key={index}>
            {option === 'Logout' ? (
              <span className="nav-option" onClick={handleLogout}>
                {option}
              </span>
            ) : (
              <Link to={`/${option.toLowerCase()}`} className="nav-option">
                {option}
              </Link>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
