import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AssignedStudents.css';
import { useAuth } from '../Authentication/auth-context';
import { firestore } from '../../firebase/firebase';


const Section = ({ title, sections, handleSectionClick, projectType }) => {
  return (
    <Grid item xs={12}>
      <Typography variant="h4" gutterBottom style={{ color: '#273656', marginBottom: '8px', textAlign: 'center', fontFamily: 'DMSans, sans-serif', fontWeight: 600, fontSize:'25px'}}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {sections.map((section, index) => (
          <Grid item key={index} xs={4}>
            <Paper
              elevation={3}
              className="custom-card"
              onClick={() => handleSectionClick(section, projectType)}
            >
              <Typography variant="h6" style={{ color: '#273656', fontSize: '30px', padding: '8px', borderRadius: '4px', marginBottom: '8px', fontFamily: 'DMSans, sans-serif', fontWeight: 700 }}>
                {section}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const AssignedStudents = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });
  const { user } = useAuth();
  const [userData, setUserData] = useState({});

  const userId = user ? user.uid : null;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        if (userId) {
          const userDocRef = doc(firestore, "Faculties", userId);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
  
            const userBranch = userData?.branch || 'Artificial Intelligence';
            console.log("user is from ",userBranch);
            const sectionRef = doc(db, 'btech', userBranch, 'year', 'IV');
            const studentsRef = doc(db, 'btech', userBranch, 'year', 'IV', 'AI-A', 'students');
  
            const [sectionDoc, studentsDoc] = await Promise.all([getDoc(sectionRef), getDoc(studentsRef)]);
  
            const sectionIds = sectionDoc.data()?.sections || [];
            const studentsData = studentsDoc.data()?.userId || [];
  
            console.log('Sections Data:', sectionIds);
            console.log('Students Data:', studentsData);
  
            setSections(sectionIds);
            setStudents(studentsData);
            setLoading(false);
          } else {
            console.log("User document not found");
          }
        } else {
          console.log("User ID is null or undefined");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    const db = getFirestore();
    const userId = user ? user.uid : null;
  
    fetchUserData(userId);
  }, [user]);
  
  
  

  const handleSectionClick = (section, projectType) => {
    navigate(`${projectType}/${section}`);
  };
  
  return (
    <animated.div style={fadeIn} className="assigned-students-container">
      {loading ? (
        <div className="loader">
          <CircularProgress style={{ color: '#3f51b5' }} />
        </div>
      ) : (
        <>
          {/* Add margin or padding here */}
          <div style={{ marginBottom: '20px' }}>
            <Section title="Major Project" sections={sections} handleSectionClick={handleSectionClick} projectType="Major"/>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Section title="Mini Project" sections={sections} handleSectionClick={handleSectionClick}projectType="Minor" />
          </div>
        </>
      )}
    </animated.div>
  );
};
export default AssignedStudents;
