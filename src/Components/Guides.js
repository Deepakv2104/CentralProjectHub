import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import ProfileCard from './ProfileCard';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { makeStyles } from "@mui/styles";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    background: "#f5f5f5",
    marginTop: "65px",
  },
  gridContainer: {
    marginTop: '20px',
  },
  gridItem: {
    margin: 40,
  },
});

const FacultiesGrid = () => {
    const [profileData, setProfileData] = useState([]);
    const classes = useStyles();
    const navigate = useNavigate(); // React Router's useNavigate hook
  
    useEffect(() => {
      const fetchData = async () => {
        const db = getFirestore();
        const profilesCollectionRef = collection(db, 'Faculties');
        const querySnapshot = await getDocs(profilesCollectionRef);
  
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
  
        setProfileData(data);
      };
  
      fetchData();
    }, []);
  
    const handleCardClick = (userId) => {
      // Concatenate the userId to the path and navigate
      console.log("clicked")
      navigate(`${userId}`);
    };
  
    return (
      <div>
        <div className={classes.filterContainer}>
          <Typography variant='h5'>
            Artificial Intelligence Guides
          </Typography>
        </div>
  
        <Grid container spacing={3} className={classes.gridContainer}>
          {profileData.map((profile) => (
            <Grid item key={profile.id} xs={12} sm={6} md={4} className={classes.gridItem}  onClick={() => handleCardClick(profile.userId)}>
              <ProfileCard
                imageUrl={profile.profilePic}
                name={profile.fullName}
                quote={profile.designation}
                rollNo={profile.branch}
                // Pass userId to the function
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };
  
  export default FacultiesGrid;