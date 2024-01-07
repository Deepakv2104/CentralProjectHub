import React, { useState,useEffect } from 'react';
import '../../Styles/FormStyle.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import StudentLoginForm from './StudentLoginForm';
import AdminLoginForm from './AdminLoginForm';
import { toast, ToastContainer } from 'react-toastify';
import StudentSignUp from './StudentSignUp';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminSignupForm from './AdminSignUp';


const LoginCard = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const auth = getAuth();

  const toggleFormVisibility = () => {
    setIsSignupVisible(!isSignupVisible);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login based on selected role
      switch (selectedRole) {
        case 'student':
          navigate('/student-dashboard/explore');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          break;
      }
    } catch (error) {
      setError(error.message);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const renderForm = () => {
    if (isSignupVisible) {
      switch (selectedRole) {
        case 'student':
          return <StudentSignUp />;
        case 'admin':
          return <AdminSignupForm/>;
        default:
          return null;
      }
    } else {
      switch (selectedRole) {
        case 'student':
          return <StudentLoginForm />;
        case 'admin':
          return <AdminLoginForm />;
        default:
          return null;
      }
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    // Handle any additional logic on close if needed
  };

  useEffect(() => {
    // Reset the isOpen state after a delay when the component unmounts
    const timeoutId = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timeoutId);
  }, []);



  return (

    <Dialog open={isOpen} fullWidth maxWidth="sm" sx={{ borderRadius: '12px' }} onClose={handleClose}>
     <IconButton
  edge="end"
  color="inherit"
  
  style={{
    paddingRight:20,
    position:'absolute',
    top: 0,
   
    right: 0,
    color: 'red', // Set the color to red
  }}
  onClick={handleClose}
>
  <CloseIcon fontSize="medium" />
</IconButton>

      
      <DialogContent sx={{ backgroundColor: '#161a30' }}>
        <div className="login-form-container1">
          <div className="card-inner1">
            <h2>{isSignupVisible ? 'Sign Up' : 'Login'}</h2>
            <div style={{ display: 'flex' }}>
              <label htmlFor="role" style={{ paddingRight: '30px' }}>
                Select Role:
              </label>
              <Select id="role" value={selectedRole} onChange={handleRoleChange}>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </div>
            {renderForm()}
            <p className="toggle-link1">
              {isSignupVisible ? 'Already a user?' : "Don't have an account?"}
              <button onClick={toggleFormVisibility}>
                {isSignupVisible ? 'Sign In' : 'Sign Up'}
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
