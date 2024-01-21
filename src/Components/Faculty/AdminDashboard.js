import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const AdminDashboard = () => {
  return (
    <NavBar>
      <Outlet />
    </NavBar>
  );
};

export default AdminDashboard;
