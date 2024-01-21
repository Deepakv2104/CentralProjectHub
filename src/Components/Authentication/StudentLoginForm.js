import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentLoginForm = () => {
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

        if (userData?.role === 'student') {
          navigate('/student-dashboard/explore');
        } else {
          console.log('User is not a student', userData);
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

      // Assuming you have a function to fetch user data based on UID
      const userData = await fetchUserData(user.uid);

      // Check if the user role is 'student'
      if (userData?.role === 'student') {
        // Delay the navigation slightly to ensure the toast is displayed
        navigate('/student-dashboard/explore');
       
        // Display a success toast
        toast.success('Login successful!', { position: 'top-right', autoClose: 1200  });
        setTimeout(() => {
          // Navigate to the student dashboard
          window.location.reload();
         
         
        }, 2000);
         // You can adjust the delay as needed
      } else {
        // If the user is not a student, reject authentication
        console.log('User is not a student');
        await signOut(auth); // Sign out the user
        throw new Error('Access denied: User is not a student');
      }
    } catch (error) {
      // Handle login errors
      console.error(error);
      // Display an error toast for invalid credentials
      toast.error('Invalid credentials. Please try again.', { position: 'top-center', autoClose: 1500 });
    }
  };
  
  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(firestore, 'students', uid));
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
          backgroundColor: '#28a745',
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

export default StudentLoginForm;
