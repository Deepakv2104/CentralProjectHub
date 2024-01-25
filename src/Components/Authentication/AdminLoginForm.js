import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await fetchUserData(user.uid);

        if (userData?.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          console.log('User is not an admin', userData);
        }
      } else {
        console.log('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user data based on UID
      const userData = await fetchUserData(user.uid);
  
      if (userData?.role !== 'admin') {
        // If the user is not an admin, reject the login
        await signOut(auth);
        throw new Error('Access denied: User is not an admin');
      }
      console.log('User UID:', user.uid);

      // Delay the navigation slightly to ensure the toast is displayed
      navigate('/admin-dashboard/explore');
  
      // Display a success toast
      toast.success('Login successful!', { position: 'top-right', autoClose: 1200 });
      setTimeout(() => {
       
      }, 2000);
      // You can adjust the delay as needed
    } catch (error) {
      // Handle login errors
      console.error(error);
      toast.error('Invalid credentials. Please try again.', { position: 'top-center', autoClose: 1500 });
    }
  };
  
  
  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(firestore, 'Faculties', uid));
    return userDoc.exists() ? userDoc.data() : null;
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
      <button
        type="button"
        onClick={handleLogin}
        style={{
          backgroundColor: 'red',
          width: '100%',
          padding: '10px',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '10px',
        }}
      >
        Login
      </button>
      <ToastContainer />
    </form>
  );
};

export default AdminLoginForm;
