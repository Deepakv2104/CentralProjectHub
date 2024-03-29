import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from "@mui/system";
import StudentDetails from "./StudentDetails";
import { SwapVert } from "@mui/icons-material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const ViewProjects = () => {
  const [projectData, setProjectData] = useState([]);
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    const db = getFirestore();
    const projectsCollection = collection(db, "projects");
    const q = query(projectsCollection, where("userId", "==", studentId));

    const unsubscribe = studentId && onSnapshot(q, updateProjects);

    return () => unsubscribe();
  }, [studentId, sortOrder]);

  const updateProjects = (snapshot) => {
    const updatedProjects = snapshot.docs.map((doc) => ({
      projectId: doc.id,
      ...doc.data(),
    }));

    // Sort the projects based on the submittedOn date
    const sortedProjects = updatedProjects.slice().sort((a, b) => {
      const dateA = new Date(a.submittedOn).getTime();
      const dateB = new Date(b.submittedOn).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setProjectData(sortedProjects);
  };

  const handleContainerClick = (projectId) => {
    // Check the role based on the current path
    const isAdmin = location.pathname.includes("/admin-dashboard");

    // Navigate based on the role
    if (isAdmin) {
      navigate(`/admin-dashboard/explore/${studentId}/${projectId}`);
    } else {
      navigate(`/student-dashboard/student-profile/${studentId}/projects/${projectId}`);
    }
  };

  const handleClickStudent = () => {
    navigate(-1);
  };

  const handleSortClick = () => {
    // Toggle the sorting order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  return (
    <div className="actual-card">
      <div
        style={{ backgroundColor: "#D2E3C8", padding: "10px" }}
        onClick={handleClickStudent}
      >
        <StudentDetails studentId={studentId} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          style={{
            marginTop: 10,
            fontWeight: 600,
            color: "#fff",
            maxWidth: "150px",
            backgroundColor: "#092635",
            padding: 10,
          }}
        >
          {studentId.name} Projects List
        </Typography>

        <IconButton onClick={handleSortClick}>
          sort
          <SwapVert />
        </IconButton>
      </div>

      {projectData.map((project, index) => (
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
      ))}
    </div>
  );
};

export default ViewProjects;
