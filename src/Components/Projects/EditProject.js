// EditProject.js

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  IconButton,
  Grid,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../Authentication/auth-context";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProject = ({ projectId, onEditDone }) => {
  const [open, setOpen] = useState(true);
  const [projectData, setProjectData] = useState({
    projectName: "",
    description: "",
    goals: "",
    process: "",
    features: [],
    github: "",
    appLink: "",
    skillsUsed: [],  
    documentation: "",
  });
  
  const { user } = useAuth();
  const userId = user.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firestore;
        const projectDocRef = doc(db, "projects", projectId);
        const projectDocSnapshot = await getDoc(projectDocRef);

        if (projectDocSnapshot.exists()) {
          const projectData = projectDocSnapshot.data();
          setProjectData(projectData);
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const handleClose = () => {
    setOpen(false);
    // Call the onEditDone callback to reset the editMode state in the parent component
    onEditDone();
  };

  const handleChange = (field, value) => {
    setProjectData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
  
    if (file && projectData.projectName) {
      try {
        const db = firestore;
        const userDocRef = doc(collection(db, "students"), userId);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
  
        if (!userData) {
          console.error("User data not found");
          return;
        }
  
        const branch = userData.branch;
        const section = userData.section;
        const rollNo = userData.rollNo;
        const year = userData.year;
  
        // Dynamic path based on user data and project name
        const storagePath = `anurag-university/students/year/${year}/${branch}/${section}/${rollNo}/${projectData.projectName}/`;
  
        // Create storage reference for documentation files
        const storageRef = ref(getStorage(), storagePath + file.name);
  
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL);
        setProjectData((prevData) => ({
          ...prevData,
          documentation: downloadURL,
        }));
      } catch (error) {
        console.error("Error uploading documentation file:", error);
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      const db = firestore;
      const projectDocRef = doc(db, "projects", projectId);

      // Update the document with the new data
      await updateDoc(projectDocRef, projectData);

      console.log("Project data updated successfully!");
      toast.success("Project updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating project data:", error);
      toast.error("Error updating project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleClose();
    }
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: "50px" }}>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ padding: "10px" }}>
              <Grid item xs={12}>
                <TextField
                  label="Project Title"
                  variant="outlined"
                  fullWidth
                  value={projectData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Goals"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={projectData.goals}
                  onChange={(e) => handleChange("goals", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Process"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={projectData.process}
                  onChange={(e) => handleChange("process", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="GitHub Repository"
                  variant="outlined"
                  fullWidth
                  value={projectData.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="App Link"
                  variant="outlined"
                  fullWidth
                  value={projectData.appLink}
                  onChange={(e) => handleChange("appLink", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Skills Used
                </Typography>
             <TextField
                  label="Skills Used"
                  variant="outlined"
                  fullWidth
                  value={
                    Array.isArray(projectData.skillsUsed)
                      ? projectData.skillsUsed.join(", ")
                      : "" // Provide a default value if skillsUsed is not an array
                  }
                  onChange={(e) =>
                    handleChange("skillsUsed", e.target.value.split(", "))
                  }
                />
              </Grid>

              {/* ... (other fields) */}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Documentation
                </Typography>
                <input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  onChange={handleFileChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default EditProject;
