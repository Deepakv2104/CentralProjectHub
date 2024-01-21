import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "@mui/material"; // Import TextField from Material-UI
import "../../Styles/Navbar.css";
import { Search } from "@mui/icons-material";
import { IconButton } from "@material-ui/core";

const Navbar = ({ onMenuToggle }) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const options = 
  
     ["Home", "Contact", "About"];

    const handleLogout = async () => {
      try {
        await signOut();
    
        // Clear any relevant application state or user-related data
    
        toast.success("Logout successful!", { position: "top-right", autoClose: 1200 });
    
        // Delay the page reload by a short amount of time
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        navigate("/home");
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Error during logout. Please try again.", {
          position: "top-center",
        });
      }
    };
    
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    onMenuToggle(); // Notify the parent component about the menu toggle
  };

  const handleSearch = () => {
    // Add logic for handling the search query
    console.log("Search query:", searchQuery);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`navbar-container ${menuOpen ? "menu-open" : ""}`}>
      {/* Text instead of logo with CSS styling */}
      <div className="logo-text">ANURAG UNIVERSITY</div>

   
     

      {/* Search Bar */}

      <div className={`nav-options ${menuOpen ? "open" : ""}`}>
        {options.map((option, index) => (
          <div key={index}>
            {option === "Logout" ? (
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
        <div
          className="search-bar"
          style={{
            height: "30px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="search"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              height: "100%",
              marginRight: "8px",
            }}
          />
          <IconButton>
            <Search />
          </IconButton>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Navbar;
