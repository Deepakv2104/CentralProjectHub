// Home.js
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Submenu/Navbar";
import { motion } from "framer-motion";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import "../Styles/Home.css";
import LoginCard from "../Components/Authentication/Login";
import { useAuth } from "../Components/Authentication/auth-context";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLoginCard = () => {
    setShowLogin(false);
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
            <h1>Centralized Project Repository System</h1>
            <p>Explore and manage your projects with ease.</p>
          </motion.div>
        </div>
        {user ? (
          null
        ) : (
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
              Login / SignUp
            </Button>
          </div>
        )}
     {showLogin && <LoginCard isOpen={showLogin} onClose={handleCloseLoginCard} />}
      </div>
    </div>
  );
};

export default Home;
