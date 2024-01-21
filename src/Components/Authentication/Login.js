// LoginCard.js
import React, { useState, useEffect } from "react";
import "../../Styles/FormStyle.css";
import { getAuth, signOut } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import StudentLoginForm from "./StudentLoginForm";
import AdminLoginForm from "./AdminLoginForm";
import { toast, ToastContainer } from "react-toastify";
import StudentSignUp from "./StudentSignUp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminSignupForm from "./AdminSignUp";

const LoginCard = ({ isOpen, onClose }) => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const auth = getAuth();

  const toggleFormVisibility = () => {
    setIsSignupVisible(!isSignupVisible);
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
  };

  const renderForm = () => {
    if (isSignupVisible) {
      switch (selectedRole) {
        case "student":
          return <StudentSignUp />;
        case "admin":
          return <AdminSignupForm />;
        default:
          return null;
      }
    } else {
      switch (selectedRole) {
        case "student":
          return <StudentLoginForm />;
        case "admin":
          return <AdminLoginForm />;
        default:
          return null;
      }
    }
  };

  const handleClose = async () => {
    // Clear any relevant application state or user-related data
    // Example: Reset state or clear local storage

    // Perform logout
    await signOut(auth);

    // Communicate the close event to the parent component
    onClose();

    // Reset local state
    setIsSignupVisible(false);
    setSelectedRole("student");

   
  };

  useEffect(() => {
    // Additional cleanup logic or side effects can go here

    // Cleanup timer, subscriptions, etc.

    // Make sure to clear any ongoing async tasks or listeners
    return () => {
      // Cleanup logic here
    };
  }, [isSignupVisible, selectedRole]);

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      sx={{ borderRadius: "12px" }}
      onClose={handleClose}
    >
      <IconButton
        edge="end"
        color="inherit"
        style={{
          paddingRight: 20,
          position: "absolute",
          top: 0,
          right: 0,
          color: "red", // Set the color to red
        }}
        onClick={handleClose}
      >
        <CloseIcon fontSize="medium" />
      </IconButton>

      <DialogContent sx={{ backgroundColor: "#161a30" }}>
        <div className="login-form-container1">
          <div className="card-inner1">
            <h2>{isSignupVisible ? "Sign Up" : "Login"}</h2>
            <div style={{ display: "flex" }}>
              <label htmlFor="role" style={{ paddingRight: "30px" }}>
                Select Role:
              </label>
              <Select
                id="role"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </div>
            {renderForm()}
            <p className="toggle-link1">
              {isSignupVisible ? "Already a user?" : "Don't have an account?"}
              <button onClick={toggleFormVisibility}>
                {isSignupVisible ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
};

export default LoginCard;
