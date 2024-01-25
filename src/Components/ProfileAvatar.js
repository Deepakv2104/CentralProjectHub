import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton, CircularProgress } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../Components/Authentication/auth-context';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    cursor: 'pointer',
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,

  },
  progress: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  hiddenInput: {
    display: 'none',
  },
}));

const ProfileAvatar = ({ userId: propUserId }) => {
  const classes = useStyles();
  const { user, initializing } = useAuth();
  const { userId: paramsUserId } = useParams();
  const userId = propUserId || (user ? user.uid : paramsUserId);


  const [profileData, setProfileData] = useState({
    profilePic: '',
    branch: '',
    section: '',
    rollNo: '',
    year: '',
    collegeId:'',
    name:'',
  });

  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userId) {
          console.log(userId);
          const studentDocRef = doc(firestore, 'students', userId);
          const facultyDocRef = doc(firestore, 'Faculties', userId);
  
          const studentDocSnapshot = await getDoc(studentDocRef);
          const facultyDocSnapshot = await getDoc(facultyDocRef);
  
          if (studentDocSnapshot.exists() && studentDocSnapshot.data().role === 'student') {
            const data = studentDocSnapshot.data();
            setProfileData({
              profilePic: data.profilePic || '',
              branch: data.branch || '',
              section: data.section || '',
              rollNo: data.rollNo || '',
              year: data.year || '',
              name: data.fullName || '',
            });
          } else if (facultyDocSnapshot.exists() && facultyDocSnapshot.data().role === 'admin') {
            const data = facultyDocSnapshot.data();
            console.log(data.fullName);
            setProfileData({
              profilePic: data.profilePic || '',
              collegeId: data.collegeId || '',
              branch: data.branch || '',
              name: data.fullName || '',
            });
          } else {
            console.log('No such document in any collection or invalid role!');
          }
        } else {
          console.log('No current user!');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    if (!initializing && user) {
      fetchProfileData();
    }
  }, [userId, initializing, user]);
  
  
  


  const handleUploadClick = () => {
    if (userId && user && userId === user.uid) {
      document.getElementById('profilePicInput').click();
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
  
    if (file) {
      try {
        console.log(profileData);
        let storagePath = '';
  
        if (userId) {
          const studentDocSnapshot = await getDoc(doc(firestore, 'students', userId));
  
          if (studentDocSnapshot.exists() && studentDocSnapshot.data().role === 'student') {
            let data = studentDocSnapshot.data();
            storagePath = `anurag-university/students/year/${data.year}/${data.branch}/${data.section}/${data.rollNo}/profilePic/`;
          } else {
            const facultyDocSnapshot = await getDoc(doc(firestore, 'Faculties', userId));
  
            if (facultyDocSnapshot.exists() && facultyDocSnapshot.data().role === 'admin') {
              const facultyData = facultyDocSnapshot.data();
              const CollegeId = facultyData.collegeId;
              const Name = facultyData.fullName;
              storagePath = `anurag-university/faculties/${facultyData.branch}/${CollegeId}/${Name}/profilePic/`;
            } else {
              console.log('No such document in any collection or invalid role!');
            }
          }
        } else {
          console.log('No current user!');
        }
  
        if (storagePath) {
          const storageRef = ref(getStorage(), storagePath);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
  
          if (userId) {
            let userCollection, userDocRef;
  
            if (storagePath.includes('students')) {
              userCollection = 'students';
            } else if (storagePath.includes('faculties')) {
              userCollection = 'Faculties';
            }
  
            if (userCollection) {
              userDocRef = doc(firestore, userCollection, userId);
  
              await setDoc(userDocRef, { profilePic: downloadURL }, { merge: true });
              setProfileData((prevData) => ({
                ...prevData,
                profilePic: downloadURL,
              }));
            } else {
              console.log('No valid user collection found.');
            }
          } else {
            console.log('No current user to update profile picture for.');
          }
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setUploading(false);
      }
    }
  };
  
  
  
  return (
    <div className={classes.avatarContainer}>
      <Avatar
        className={classes.avatar}
        src={userId ? profileData.profilePic : 'path_to_dummy_avatar.jpg'}
        alt="Profile"
        onClick={handleUploadClick}
      />
      {userId && user && userId === user.uid && (
        <IconButton className={classes.editIcon} onClick={handleUploadClick}>
          <EditIcon />
        </IconButton>
      )}
      {uploading && (
        <div className={classes.progress}>
          <CircularProgress color="secondary" />
        </div>
      )}
      <input
        id="profilePicInput"
        className={classes.hiddenInput}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileAvatar;
