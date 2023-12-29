import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ProjectSubmission from "./AddProject";
import "../../Styles/MyProjects.css";
import { useAuth } from "../Authentication/auth-context";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from "@mui/system";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const MyProjects = () => {
  const [projectData, setProjectData] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = useState(false);

  useEffect(() => {
    // Set up real-time listener for updates
    const db = getFirestore();
    const projectsCollection = collection(db, "projects");
    const q = query(projectsCollection, where("userId", "==", userId));

    const unsubscribe =
      userId &&
      onSnapshot(q, (snapshot) => {
        const updatedProjects = snapshot.docs.map((doc) => ({
          projectId: doc.id,
          ...doc.data(),
        }));
        console.log("Updated projects:", updatedProjects);
        setProjectData(updatedProjects);
      });

    // Unsubscribe from the listener when the component is unmounted
    return () => unsubscribe();
  }, [userId]);

  const handleContainerClick = (projectId) => {
    navigate(`/student-dashboard/add-project/${projectId}`);
    console.log("Clicked on project with projectId:", projectId);
  };

 


  return (
    <div className="actual-card">
       <div className="back-and-project-container">
        <div className="back-icon-container">
          <IconButton
            aria-label="back"
            onClick={() => navigate(-1)}
            style={{ marginRight: "16px" }}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div className="left-container">
          <ProjectSubmission />
        </div>
      </div>

      {projectData.map((project, index) => (
        <div className="c2" key={index}>
          {/* Flex container for project title and delete button */}
          <div className="project-title-container">
            <div
              className="project-titile"
              onClick={() => handleContainerClick(project.projectId)}
            >
              {project.projectName}
            </div>
            {/* Delete button */}
            <StyledIconButton
              aria-label="delete"
              className="delete-button"
              onClick={() => handleContainerClick(project.projectId)}
            >
              <RemoveRedEyeIcon />
            </StyledIconButton>
          </div>

          <div className="project-discription">
            {project.description}
          </div>

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
      ))}
    </div>
  );
};

export default MyProjects;
