import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Submenu/Navbar';
import Sidebar from '../Components/Submenu/SideBar';
import '../Styles/Dashboard.css';
import { useAuth } from '../Components/Authentication/auth-context';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(true);

  if (!user) {
    // User is not authenticated
    return <div>Not authenticated</div>;
  }

  const userId = user.uid;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    console.log(setMenuOpen)
  };

  return (
    <div className='dashboard-container'>
      <Navbar onMenuToggle={handleMenuToggle} /> {/* Pass onMenuToggle prop here */}
      <div className='content-container'>
        {menuOpen && <Sidebar />}
        <div className='main-content'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
