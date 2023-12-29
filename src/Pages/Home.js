// Home.js
import React, { useState } from "react";
import Navbar from "../Components/Submenu/Navbar";
import { motion } from "framer-motion";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, IconButton } from '@mui/material';
import "../Styles/Home.css";
import LoginCard from "../Components/Authentication/Login";
import { useAuth } from "../Components/Authentication/auth-context"; // Import your authentication context

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth(); // Assuming you have a user object in your authentication context

  const handleLoginClick = () => {
    setShowLogin(prevShowLogin => !prevShowLogin);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="text-container">
        <div style={{ display: "flex" }}>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h1>Your Project Repository</h1>
            <p>Explore and manage your projects with ease.</p>
          </motion.div>
        </div>
        {user ? (
          // Render nothing if the user is logged in
          null
        ) : (
          // Render the login button if the user is not logged in
          <div style={{ display: "flex" }}>
            <Button
              type="button"
              onClick={handleLoginClick}
              style={{
                backgroundColor: "#28a745",
                width: "100%",
                padding: "10px",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                margin: 20,
              }}
            >
              Login
            </Button>
          </div>
        )}
        {showLogin && <LoginCard />} {/* Conditionally render the Login component */}
      </div>
    </div>
  );
};

export default Home;
