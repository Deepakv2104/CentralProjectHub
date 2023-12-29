// ProjectList.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Grid } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const ProjectCard = ({ project }) => {
  const cardStyle = {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    },
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    color: '#555',
  };

  return (
    <Card style={cardStyle}>
      <CardContent>
        <Typography style={titleStyle} gutterBottom>
          {project.projectName}
        </Typography>
        <Typography style={descriptionStyle} color="textSecondary">
          Description: {project.description}
        </Typography>
        {/* Add more project details as needed */}
      </CardContent>
    </Card>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'projects'));
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '50px' }}>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectList;
