import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
// import DeleteIcon from "@material-ui/icons/Delete";
import ProjectSubmission from "./AddProject";
import "../../Styles/MyProjects.css";
import { useAuth } from "../Authentication/auth-context";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from "@mui/system";
import { ArrowUpwardRounded, SwapVert } from "@mui/icons-material";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const projectsCollection = collection(db, "projects");
        const q = query(projectsCollection, where("userId", "==", userId));
        
        // Retrieve initial data
        const initialQuerySnapshot = await getDocs(q);
        const initialProjects = initialQuerySnapshot.docs.map((doc) => ({
          projectId: doc.id,
          ...doc.data(),
        }));
  
        // Set initial data and loading state
        setProjectData(initialProjects);
        setLoading(false);
  
        // Set up real-time listener for updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
          updateProjects(snapshot);
        });
  
        // Unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false even in case of an error
      }
    };
  
    fetchData();
  }, [userId, sortOrder]);
  

  const updateProjects = (snapshot) => {
    const updatedProjects = snapshot.docs.map((doc) => ({
      projectId: doc.id,
      ...doc.data(),
    }));

    // Sort the projects based on the submittedOn date
    const sortedProjects = updatedProjects.sort((a, b) => {
      const dateA = new Date(a.submittedOn).getTime();
      const dateB = new Date(b.submittedOn).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setProjectData(sortedProjects);
  };


  const handleSortClick = () => {
    // Toggle the sorting order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleContainerClick = (projectId) => {
    navigate(`/student-dashboard/add-project/${projectId}`);
    console.log("Clicked on project with projectId:", projectId);
  };

  return (
    <div className="actual-card">

      <div style={{ display: "flex" ,  width: "90%",
    maxWidth: "1210px",
    margin: "10px auto"}}>
       
        <ProjectSubmission />
        <IconButton sx={{BackgroundColor:'black'}}onClick={handleSortClick}>
            sort
          <SwapVert />
        </IconButton>
      </div>

      {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        ) : (<div>{projectData.map((project, index) => (
          <div className="c2" key={index}>
     
           <div className="project-title-container">
              <div
                className="project-titile"
                onClick={() => handleContainerClick(project.projectId)}
              >
                {project.projectName}
              </div>
              <div className="project-submittedOn">{project.submittedOn}</div>
              <StyledIconButton
                aria-label="delete"
                className="delete-button"
                onClick={() => handleContainerClick(project.projectId)}
              >
                <RemoveRedEyeIcon />
              </StyledIconButton>
            </div>
  
            <div className="project-discription">{project.description}</div>
  
            <div className="skills">
              <ul>
                {project.skillsUsed && Array.isArray(project.skillsUsed) ? (
                  project.skillsUsed.map((skill, skillIndex) => (
                    <li key={skillIndex}>{skill}</li>
                  ))
                ) : (
                  <li>No skills available</li>
                )}
              </ul>
            </div>
  
            
           
          </div>
        )
        
        )
        
        }
         <hr style={{ border: "1px solid #333" }} /></div>)}
      
    </div>
    
  );
};

export default MyProjects;
