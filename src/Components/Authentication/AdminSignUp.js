import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { Select, InputLabel, MenuItem, Typography, Input } from '@mui/material';
import { toast } from 'react-toastify';


// ... (previous imports)

const AdminSignUp = () => {
  const [branchesData, setBranchesData] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  
    password: '',
   
    branch: '', // Added branch field
    // Add other fields as needed
  });

  useEffect(() => {
    const fetchBranchesData = async () => {
      try {
        const branchesCollectionRef = collection(firestore, 'Branches');
        const branchesCollectionSnapshot = await getDocs(branchesCollectionRef);

        if (!branchesCollectionSnapshot.empty) {
          // Assuming there's only one document in 'Branches'
          const branchesDocData = branchesCollectionSnapshot.docs[0].data();
          setBranchesData(branchesDocData);
        } else {
          console.error('Branches document not found');
        }
      } catch (error) {
        console.error('Error fetching branches data:', error);
      }
    };

    fetchBranchesData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSignup = async () => {
    try {
      // 1. Create a new admin user with Firebase Authentication
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const { user } = userCredential;

      // 2. Add admin user details to Firestore with role set to 'admin'
      const adminDocRef = doc(firestore, 'Faculties', user.uid);
      await setDoc(adminDocRef, {
        userId: user.uid,
        role: 'admin', // Set the user role to 'admin'
        ...formData,
        // Add other fields as needed
      });

      // Show success toast
      toast.success('Admin signup successful!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      // Redirect or perform other actions after successful signup
    } catch (error) {
      // Show error toast
      toast.error(`Admin signup failed: ${error.message}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      console.error('Error signing up admin:', error.message);
    }
  };

  return (
    <div className="admin-sign-up-container">
      <form className="admin-sign-up-form">
        {/* Render form fields */}
        {Object.entries(formData).map(([field, value]) => (
          <div key={field} className="form-field">
            {field === 'branch' ? (
              <div>
                
                <Select
                  fullWidth
                  value={value}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  displayEmpty
                  inputProps={{
                    name: field,
                    id: `${field}-select`,
                  }}
                  renderValue={(selected) => (selected ? selected : `Select ${field}`)}
                >
                  <MenuItem value="" disabled>
                    <Typography variant="body2" color="textSecondary">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                  </MenuItem>
                  {branchesData[field] &&
                    branchesData[field].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            ) : (
              <Input
                disableUnderline
                fullWidth
                type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* Signup button */}
        <button type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default AdminSignUp;
