import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import ProfileCard from './ProfileCard';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { makeStyles } from "@mui/styles";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles({
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    background: "#f5f5f5",
  
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
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const db = getFirestore();
          const profilesCollectionRef = collection(db, 'Faculties');
          const querySnapshot = await getDocs(profilesCollectionRef);
  
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
  
          // Simulate a delay of 2 seconds before setting loading to false
          setTimeout(() => {
            setProfileData(data);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Set loading to false even in case of an error
        }
      };
  
      fetchData();
    }, []);
  
    const handleCardClick = (userId) => {
      navigate(`${userId}`);
    };
  
    return (
      <div>
        <div className={classes.filterContainer}>
          <Typography variant='h5'>Artificial Intelligence Guides</Typography>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={3} className={classes.gridContainer}>
            {profileData.map((profile) => (
              <Grid
                item
                key={profile.id}
                xs={12}
                sm={6}
                md={4}
                className={classes.gridItem}
                onClick={() => handleCardClick(profile.userId)}
              >
                <ProfileCard
                  imageUrl={profile.profilePic}
                  name={profile.fullName}
                  quote={profile.designation}
                  rollNo={profile.email}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    );
  };
  
  export default FacultiesGrid;