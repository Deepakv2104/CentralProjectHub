import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './Components/Authentication/auth-context';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useAuth(); // Replace with your authentication context
  console.log('User and Role:', user, user?.role);
  if (loading) {
    // Loading state, you can also render a loading spinner
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to an access-denied page or handle the case where the user's role is not allowed
    return <Navigate to="/access-denied" />;
  }

  // If the user is authenticated and has the correct role, render the specified element
  return <Route element={element} />;
};

export default PrivateRoute;
