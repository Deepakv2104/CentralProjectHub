import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

const StudentLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      // If the login is successful, navigate to the student dashboard
      navigate('/student-dashboard/explore');
      
      // Display a success toast
      toast.success('Login successful!');
    } catch (error) {
      // Handle login errors (e.g., incorrect credentials)
      console.error(error.message);
      
      // Display an error toast
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button type="button" onClick={handleLogin} style={{ backgroundColor: "#28a745", width: '100%', padding: '10px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>Login</button>
    </form>
  );
};

export default StudentLoginForm;
