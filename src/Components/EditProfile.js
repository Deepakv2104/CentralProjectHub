// EditProfile.js

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
  Grid,
} from "@mui/material";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../Components/Authentication/auth-context";
import { firestore } from "../../src/firebase/firebase";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
const EditProfile = ({ onEditDone }) => {
  const [open, setOpen] = useState(true);
  const [readOnlyInteraction, setReadOnlyInteraction] = useState(false);
  const [userData, setUserData] = useState({
    branch: "",
    city: "",
    country: "",
    github: "",
    linkedin: "",
    name: "",

    rollNo: "",
    section: "",
    skills: [],
    state: "",
    twitter: "",
    website: "",
    year: "",
  });

  const { user } = useAuth();
  const userId = user.uid;

  useEffect(() => {
    const userDocRef = doc(firestore, "students", userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserData(userData);
      } else {
        console.error("User not found");
      }
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component is unmounted
      unsubscribe();
    };
  }, [userId]);

  const handleClose = () => {
    setOpen(false);
    onEditDone();
  };

  const handleChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleReadOnlyInteraction = () => {
    setReadOnlyInteraction(true);
  };
  const updateProjectsCollection = async (updatedBranch) => {
    try {
      const projectsCollectionRef = collection(firestore, "projects");
      const projectsQuery = query(
        projectsCollectionRef,
        where("userId", "==", userId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      const updatePromises = [];
      projectsSnapshot.forEach((projectDoc) => {
        const projectData = projectDoc.data();
        updatePromises.push(
          updateDoc(doc(firestore, "projects", projectDoc.id), {
            branch: updatedBranch,
          })
        );
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating projects collection:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userDocRef = doc(firestore, "students", userId);
      await updateDoc(userDocRef, userData);
  
      // Update the 'projects' collection
      if (userData.branch) {
        await updateProjectsCollection(userData.branch);
      }
  
      toast.success("User data updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user data. Please try again.");
      handleClose();
    }
  };

  return (
    <Container component="main" maxWidth="md" style={{ marginTop: "50px" }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ padding: "10px" }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={userData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Roll No"
                variant="outlined"
                fullWidth
                value={userData.rollNo}
                onChange={(e) => handleChange("rollNo", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
        <TextField
          label="Branch"
          variant="outlined"
          fullWidth
          value={userData.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          InputProps={{
            readOnly: true,
            onFocus: handleReadOnlyInteraction,
            onClick: handleReadOnlyInteraction,
          }}
        />
        <Typography
          variant="body2"
          color={readOnlyInteraction ? "error" : "textSecondary"}
          style={{ marginTop: "5px" }}
        >
          {readOnlyInteraction
            ? "Changes not allowed. Please contact the admin."
            : "To change this field, please contact the admin."}
        </Typography>
      </Grid>
<Grid item xs={12}>
  <TextField
    label="Year"
    variant="outlined"
    fullWidth
    value={userData.year}
    onChange={(e) => handleChange("year", e.target.value)}
    InputProps={{
      readOnly: true,
      onFocus: handleReadOnlyInteraction,
      onClick: handleReadOnlyInteraction,
 
    }}
  />
  <Typography
          variant="body2"
          color={readOnlyInteraction ? "error" : "textSecondary"}
          style={{ marginTop: "5px" }}
        >
          {readOnlyInteraction
            ? "Changes not allowed. Please contact the admin."
            : "To change this field, please contact the admin."}
        </Typography>
</Grid>
<Grid item xs={12}>
  <TextField
    label="Section"
    variant="outlined"
    fullWidth
    value={userData.section}
    onChange={(e) => handleChange("section", e.target.value)}
    InputProps={{
      readOnly: true,
      onFocus: handleReadOnlyInteraction,
      onClick: handleReadOnlyInteraction,
 
    }}
  />
  <Typography
          variant="body2"
          color={readOnlyInteraction ? "error" : "textSecondary"}
          style={{ marginTop: "5px" }}
        >
          {readOnlyInteraction
            ? "Changes not allowed. Please contact the admin."
            : "To change this field, please contact the admin."}
        </Typography>
</Grid>


            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <TextField
                label="Skills"
                variant="outlined"
                fullWidth
                value={userData.skills ? userData.skills.join(", ") : ""}
                onChange={(e) =>
                  handleChange("skills", e.target.value.split(", "))
                }
              />
            </Grid>
       
            <Grid item xs={12}>
              <TextField
                label="GitHub"
                variant="outlined"
                fullWidth
                value={userData.github}
                onChange={(e) => handleChange("github", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="LinkedIn"
                variant="outlined"
                fullWidth
                value={userData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </Grid>

           
            
            <Grid item xs={12}>
              <TextField
                label="Twitter"
                variant="outlined"
                fullWidth
                value={userData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                variant="outlined"
                fullWidth
                value={userData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                value={userData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State"
                variant="outlined"
                fullWidth
                value={userData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={userData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </Grid>
            {/* Add other fields as needed */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProfile;
