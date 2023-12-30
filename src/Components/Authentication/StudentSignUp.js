import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { makeStyles } from '@material-ui/core/styles';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, Select, InputLabel, MenuItem, Typography } from '@mui/material';
import '../../Styles/StudentSignUp.css';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid } from '@mui/material';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    cursor: 'pointer',
  },
  uploadButton: {
    marginTop: theme.spacing(1),
  },
  hiddenInput: {
    display: 'none',
  },
  multiRowMenu: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)', // Adjust the number of columns as needed
    gap: theme.spacing(1),
  },
}));

const StudentSignUp = () => {
  const navigate = useNavigate();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [branchesData, setBranchesData] = useState({});
  const classes = useStyles();

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
  

  // Fields for each section
  const sections = [
    ['name', 'rollNo', 'branch', 'section', 'year'],
    ['city', 'state', 'country'],
    ['email', 'password', 'confirmPassword'],
  ];

  const [formData, setFormData] = useState(
    sections.map((section) =>
      section.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
    )
  );

  const handleInputChange = (sectionIndex, field, value) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[sectionIndex][field] = value;
      return newData;
    });
  };

  const handleNext = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (sectionIndex > 0) {
      setSectionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          profilePic: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async () => {
    try {
      // 1. Create a new user with Firebase Authentication
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData[2].email,
        formData[2].password
      );
      const { user } = userCredential;

      // 2. Add user details to Firestore
      const userDocRef = doc(firestore, 'students', user.uid);
      await setDoc(userDocRef, {
        userId: user.uid,
        ...formData[0],
        ...formData[1],
        profilePic: formData[sectionIndex].profilePic || '',
      });

      // Show success toast
      toast.success('Signup successful!', {
        position: 'top-center',
        autoClose: 3000, // Auto-close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      // Additional logic, e.g., refresh the page
      console.log('User signed up successfully:', user);
      window.location.reload(); // Refresh the page
    } catch (error) {
      // Show error toast
      toast.error(`Signup failed: ${error.message}`, {
        position: 'top-center',
        autoClose: 5000, // Auto-close the toast after 5000 milliseconds (5 seconds)
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="student-sign-up-container">
      <form className="student-sign-up-form">
        {/* Render form fields for the current section */}
        {sections[sectionIndex].map((field) => (
          <div key={field} className="form-field">
            {field === 'profilePic' ? (
              <label className="avatar-label">
                {/* ... (unchanged code for profilePic) */}
              </label>
            ) : field === 'branch' || field === 'section' || field === 'year' ? (
              <div>
                <InputLabel htmlFor={`${field}-select`} shrink={false}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </InputLabel>
                <Select
                  value={formData[sectionIndex][field]}
                  onChange={(e) => handleInputChange(sectionIndex, field, e.target.value)}
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
              <input
                type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[sectionIndex][field]}
                onChange={(e) => handleInputChange(sectionIndex, field, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="button-container">
          <button type="button" onClick={handlePrevious} disabled={sectionIndex === 0}>
            Previous
          </button>
          <button type="button" onClick={handleNext} disabled={sectionIndex === sections.length - 1}>
            Next
          </button>
        </div>

        {sectionIndex === sections.length - 1 && (
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        )}

        {/* Hidden file input for profile picture upload */}
        <input
          id="profilePicInput"
          type="file"
          accept="image/*"
          onChange={handleProfilePicUpload}
          className={classes.hiddenInput}
        />
      </form>
    </div>
  );
};

export default StudentSignUp;
