import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import { styled } from "@mui/system";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import EditProject from "./EditProject";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import DownloadDocument from "./DownloadDocument";
import { useAuth } from "../Authentication/auth-context";
import StudentDetails from "./StudentDetails";
import { useLocation } from "react-router-dom";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SingleProjectCard = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const projectsCollectionRef = collection(db, "projects");

        const unsubscribe = onSnapshot(
          projectsCollectionRef,
          (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.id === projectId) {
                const projectData = doc.data();
                console.log("userId", projectData.userId);
                setSelectedProject(projectData);
                setLoading(false);
              }
            });
          }
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching project data:", error);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [projectId]);

  const handleDeleteProject = async () => {
    try {
      if (
        !projectId ||
        !auth.user ||
        auth.user.uid !== selectedProject.userId
      ) {
        console.error("Invalid projectId or unauthorized:", projectId);
        return;
      }

      const db = getFirestore();
      const projectRef = doc(db, "projects", projectId);

      await deleteDoc(projectRef);
      console.log("Project deleted successfully:", projectId);

      // Navigate back to the desired location after successful deletion
      navigate(-1); // This will navigate back one step in the history stack

      // Show a success toast
      toast.success("Project deleted successfully!", {
        autoClose: 3000, // You can adjust the duration of the toast
      });
    } catch (error) {
      console.error("Error deleting project from Firebase:", error);
      // Show an error toast if deletion fails
      toast.error("Error deleting project. Please try again later.");
    }
  };

  const handleEditProject = () => {
    if (auth.user && auth.user.uid === selectedProject.userId) {
      setEditMode(true);
    } else {
      console.error("Unauthorized to edit this project");
    }
  };

  const handleEditProjectDone = () => {
    setEditMode(false);
  };
  const handleStudentDetailsClick = () => {
    const isStudentProfilePath = location.pathname.includes("/student-dashboard/profile/");
    const isAdminProfilePath = location.pathname.includes("/admin-dashboard/explore/");
  
    if (isStudentProfilePath) {
      navigate(`/student-dashboard/profile/${selectedProject.userId}/`);
    } else if (isAdminProfilePath) {
      const match = location.pathname.match(/^\/admin-dashboard\/explore\/(\w+)\/(\d+)$/);
      if (match) {
        const branch = match[1];
        const projectId = match[2];
        navigate(`/admin-dashboard/explore/${branch}/${projectId}`);
      } else {
        console.error("Invalid path format for admin dashboard");
        // Navigate to a default admin dashboard location if needed
        navigate(`/admin-dashboard/student-profile/${selectedProject.userId}`);
      }
    } else {
      console.log('am herer')
      navigate(`/student-dashboard/student-profile/${selectedProject.userId}`);
    }
  };
  

  const getFileNameFromUrl = (url) => {
    // Extract the filename from the URL
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  return (
    <div >
      <Card style={cardStyle}>
        <CardContent>
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
              <p>Loading...</p>
            </div>
          ) : (
            <div>
              <div style={titleStyle}>
                <Typography variant="h5">
                  {selectedProject && selectedProject.projectName}
                </Typography>
                {auth.user && auth.user.uid === selectedProject.userId && (
                  <div>
                    <StyledIconButton
                      aria-label="delete"
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject();
                      }}
                    >
                      <DeleteIcon />
                    </StyledIconButton>
                    <StyledIconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(projectId);
                      }}
                    >
                      <EditIcon />
                    </StyledIconButton>
                  </div>
                )}
              </div>
              {editMode && (
                <EditProject
                  projectId={projectId}
                  onEditDone={handleEditProjectDone}
                />
              )}
              <Typography style={descriptionStyle}>
                <strong>Description:</strong> {selectedProject.description}
              </Typography>
              <Typography style={sectionStyle}>
                <strong>Goal:</strong> {selectedProject.goals}
              </Typography>
              <Typography style={sectionStyle}>
                <strong>Process:</strong> {selectedProject.process}
              </Typography>
              <Typography style={sectionStyle}>
                <strong>Features:</strong> {selectedProject.features}
              </Typography>
              <strong>Skills:</strong>
              <div className="skills">
                <ul>
                  {Array.isArray(selectedProject.skillsUsed) &&
                  selectedProject.skillsUsed.length > 0 ? (
                    selectedProject.skillsUsed.map((skill, skillIndex) => (
                      <li key={skillIndex}>{skill}</li>
                    ))
                  ) : (
                    <li>No skills available</li>
                  )}
                </ul>
              </div>

              <Typography style={sectionStyle}>
                <strong>App Link:</strong>
                {selectedProject.appLink && (
                  <a
                    href={selectedProject.appLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {selectedProject.appLink}
                  </a>
                )}
              </Typography>
              <Typography style={sectionStyle}>
                <strong>Github:</strong>
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {selectedProject.github}
                  </a>
                )}
              </Typography>
              <Typography style={sectionStyle}>
                <strong>Submitted On:</strong>
                {selectedProject.submittedOn && (
                  <a
                    href={selectedProject.submittedOn}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {selectedProject.submittedOn}
                  </a>
                )}
              </Typography>
              <Typography style={sectionStyle}>
                <div style={{display:'flex'}}>
                <strong>Download Dcoumnet</strong> {fileName}
                {selectedProject.documentation && (
                  <a
                    href={selectedProject.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {fileName}
                  </a>
                )}
                <DownloadDocument
                  projectId={projectId}
                  projectData={selectedProject}
                />
                </div>
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
      <Card style={cardStyle1} onClick={handleStudentDetailsClick}>
        <CardContent>
          {selectedProject && selectedProject.userId && (
            <StudentDetails studentId={selectedProject.userId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
const cardStyle = {
  marginTop: "10px",
  padding: "20px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 1)",
  },
};
const cardStyle1 = {
  marginTop: "10px",
  padding: "20px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease-in-out",
  cursor: "pinter",
  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 1)",
  },
};

const titleStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "10px",
};
const descriptionStyle = {
  fontSize: "1rem",
  marginBottom: "15px",
};

const sectionStyle = {
  fontSize: "1rem",
  marginBottom: "10px",
};

const linkStyle = {
  color: "#1976D2",
  textDecoration: "none",
  marginLeft: "5px",
};
export default SingleProjectCard;
