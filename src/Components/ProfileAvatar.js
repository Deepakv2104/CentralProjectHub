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
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userId) {
          const userDocRef = doc(firestore, 'students', userId);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setProfileData({
              profilePic: data.profilePic || '',
              branch: data.branch || '',
              section: data.section || '',
              rollNo: data.rollNo || '',
            });
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No current user!');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (!initializing) {
      fetchProfileData();
    }
  }, [userId, initializing]);

  const handleUploadClick = () => {
    if (userId && user && userId === user.uid) {
      document.getElementById('profilePicInput').click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const { branch, section, rollNo } = profileData;
        const Branch = branch;
        const Section = section.toLowerCase();

        setUploading(true); // Set uploading state to true

        const storageRef = ref(
          getStorage(),
          `anurag-university/students/branches/${Branch}/${Section}/${rollNo}/profilePic/`
        );
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        if (userId) {
          const userDocRef = doc(firestore, 'students', userId);
          await setDoc(userDocRef, { profilePic: downloadURL }, { merge: true });
          setProfileData((prevData) => ({
            ...prevData,
            profilePic: downloadURL,
          }));
        } else {
          console.log('No current user to update profile picture for.');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setUploading(false); // Set uploading state back to false
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
