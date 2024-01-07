// ProjectSubmission.js
import React, { useState } from "react";
import { useAuth } from "../Authentication/auth-context";
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
  Box,
  Paper,
  MenuItem,
  Select
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import Edit from "@mui/icons-material/Edit";
import ProjectCount from "../ProjectCount";

const ProjectSubmission = () => {
  const { user } = useAuth();
  const userId = user.uid;
  const [open, setOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    projectName: "",
    description: "",
    goals: "",
    process: "",
    features: [],
    github: "",
    appLink: "",
    skillsUsed: [],
    documentation: "", // New field for storing documentation URL
  });
  const [wordCount, setWordCount] = useState({
    description: 0,
  });

  const [wordCountDescription, setWordCountDescription] = useState(0);
  const [wordCountGoals, setWordCountGoals] = useState(0);
  const [wordCountProcess, setWordCountProcess] = useState(0);
  const [submissionDate, setSubmissionDate] = useState("");
  const WORD_LIMIT_DESCRIPTION_GOALS = 100;
  const WORD_LIMIT_PROCESS = 200;
  const domainOptions = [
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Web Development", label: "Web Development" },
    { value: "IOT", label: "IOT" },
    // Add more options as needed
  ];
  // Create storage reference for documentation files
  // Create storage reference for documentation files
  const counterStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "80px",
    border: "2px solid #333",
    borderRadius: "8px",
    fontSize: "2rem",
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
    color: "#333",
  };
  const handleTextChange = (field, value, wordLimit) => {
    const words = value.split(/\s+/);

    switch (field) {
      case "description":
        if (words.length <= wordLimit) {
          setProjectData((prevData) => ({
            ...prevData,
            [field]: value,
          }));
          setWordCountDescription(words.length);
        }
        break;

      case "goals":
        if (words.length <= wordLimit) {
          setProjectData((prevData) => ({
            ...prevData,
            [field]: value,
          }));
          setWordCountGoals(words.length);
        }
        break;

      case "process":
        if (words.length <= wordLimit) {
          setProjectData((prevData) => ({
            ...prevData,
            [field]: value,
          }));
          setWordCountProcess(words.length);
        }
        break;

      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setWordCount({
      description: 0,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setProjectData({
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
  };

  const handleChange = (field, value) => {
    setProjectData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
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

        // Dynamic path based on user data
        const storagePath = `anurag-university/students/year/${year}/${branch}/${section}/${rollNo}/${projectData.projectName}/`;

        // Create storage reference for documentation files
        const storageRef = ref(getStorage(), storagePath + file.name);

        console.log("Storage Reference:", storageRef);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log("Download URL:", downloadURL);

        setProjectData((prevData) => ({
          ...prevData,
          documentation: downloadURL,
        }));

        console.log("Updated Project Data:", projectData);
      } catch (error) {
        console.error("Error uploading documentation file:", error);
      }
    }
  };

  const handleFeatureChange = (index, value) => {
    setProjectData((prevData) => {
      const updatedFeatures = [...prevData.features];
      updatedFeatures[index] = value;
      return {
        ...prevData,
        features: updatedFeatures,
      };
    });
  };

  const handleAddFeature = () => {
    setProjectData((prevData) => ({
      ...prevData,
      features: [...prevData.features, ""],
    }));
  };

  const handleSkillChange = (index, value) => {
    setProjectData((prevData) => {
      const updatedSkills = [...prevData.skillsUsed];
      updatedSkills[index] = value;
      return {
        ...prevData,
        skillsUsed: updatedSkills,
      };
    });
  };

  const handleAddSkill = () => {
    setProjectData((prevData) => ({
      ...prevData,
      skillsUsed: [...prevData.skillsUsed, ""],
    }));
  };

  const handleSubmit = async () => {
    try {
      const db = firestore;
      const currentDate = new Date();
      const formattedDate = format(currentDate, "dd-MMM-yyyy");
      const flattenedProjectData = {
        ...projectData,
        userId: userId,
        features: Array.isArray(projectData.features)
          ? projectData.features
          : projectData.features.split(",").map((feature) => feature.trim()),
        skillsUsed: Array.isArray(projectData.skillsUsed)
          ? projectData.skillsUsed
          : projectData.skillsUsed.split(",").map((skill) => skill.trim()),
      };

      const userDocRef = doc(collection(db, "students"), userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userBranch = userDocSnapshot.data()?.branch

      // if (!userBranch) {
      //   console.error("User branch is undefined or empty");
      //   return;
      // }

      const projectWithBranch = { ...flattenedProjectData};
      const projectWithBranchAndDate = {
        ...flattenedProjectData,
        branch: userBranch,
        submittedOn: formattedDate, // Add the submission date
      };
      await addDoc(collection(db, "projects"), projectWithBranchAndDate);

      console.log(
        "Data successfully submitted to Firebase:",
        projectWithBranchAndDate
      );
      toast.success("Project submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      handleClose();
      setProjectData({
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
    } catch (error) {
      console.error("Error submitting data to Firebase:", error);
      toast.error("Error submitting project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleClose();
      setProjectData({
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
    }
  };

  return (
    <Container container="main" maxWidth="md" > 
   <Box sx={{display:'flex', marginLeft:'15px'}}>
   <Box
        sx={{
          display: "flex",
    
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            padding: "5px",
            backgroundColor: "#092635",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
         
          }}
        
        >
          <IconButton sx={{color:"white"}} aria-label="edit">
          Project List
          </IconButton>
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
    
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
             marginLeft:5,
            display: "flex",
            padding: "5px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={handleOpen}
        >
          <IconButton color="secondary" aria-label="edit">
            Add Project
            <Edit />
          </IconButton>
        </Paper>
      </Box>

   </Box>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Project Submission Form</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ padding: "10px" }}>
            <DialogContent>
              <Grid container spacing={2} style={{ padding: "10px" }}>
                <Grid item xs={12}>
                  <TextField
                    label="Project Title"
                    variant="outlined"
                    fullWidth
                    value={projectData.projectName}
                    onChange={(e) =>
                      handleChange("projectName", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleTextChange(
                        "description",
                        e.target.value,
                        WORD_LIMIT_DESCRIPTION_GOALS
                      )
                    }
                  />

                  <Typography
                    variant="caption"
                    color={
                      wordCountDescription > WORD_LIMIT_DESCRIPTION_GOALS
                        ? "error"
                        : "textSecondary"
                    }
                  >
                    {`${
                      wordCountDescription || 0
                    } words / ${WORD_LIMIT_DESCRIPTION_GOALS} words limit`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Goals"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={projectData.goals}
                    onChange={(e) =>
                      handleTextChange(
                        "goals",
                        e.target.value,
                        WORD_LIMIT_DESCRIPTION_GOALS
                      )
                    }
                  />

                  <Typography
                    variant="caption"
                    color={
                      wordCountGoals > WORD_LIMIT_DESCRIPTION_GOALS
                        ? "error"
                        : "textSecondary"
                    }
                  >
                    {`${
                      wordCountGoals || 0
                    } words / ${WORD_LIMIT_DESCRIPTION_GOALS} words limit`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Process"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={projectData.process}
                    onChange={(e) =>
                      handleTextChange(
                        "process",
                        e.target.value,
                        WORD_LIMIT_PROCESS
                      )
                    }
                  />

                  <Typography
                    variant="caption"
                    color={
                      wordCountProcess > WORD_LIMIT_PROCESS
                        ? "error"
                        : "textSecondary"
                    }
                  >
                    {`${
                      wordCountProcess || 0
                    } words / ${WORD_LIMIT_PROCESS} words limit`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
        <Typography variant="h6">
          Domain
          <Select
            style={{ marginBottom: "10px" }}
            variant="outlined"
            fullWidth
            value={projectData.domain || ""} // Set the value of the Select component
            onChange={(e) => handleChange("domain", e.target.value)}
            displayEmpty // Allows displaying an empty value
          >
            {/* Placeholder MenuItem */}
            <MenuItem value="" disabled>
              Select Domain
            </MenuItem>
            {/* Render MenuItem components using the domainOptions array */}
            {domainOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Typography>
      </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  {projectData.features.map((feature, index) => (
                    <TextField
                      style={{ marginBottom: "10px" }}
                      key={index}
                      label={`Feature ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                    />
                  ))}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddFeature}
                  >
                    + New Feature
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Skills Used
                  </Typography>
                  {projectData.skillsUsed.map((skill, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <TextField
                        label={`Skill ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={skill}
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddSkill}
                  >
                    + Add Skill
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Links
                  </Typography>
                  {/* Link to the App */}
                  <TextField
                    style={{ marginBottom: "10px" }}
                    label="App Link"
                    variant="outlined"
                    fullWidth
                    value={projectData.appLink || ""}
                    onChange={(e) => handleChange("appLink", e.target.value)}
                  />
                  {/* Link to Github */}
                  <TextField
                    label="GitHub Link"
                    variant="outlined"
                    fullWidth
                    value={projectData.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                  />
                </Grid>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ color: "#333", marginRight: "8px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#28a745", color: "#fff" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectSubmission;
