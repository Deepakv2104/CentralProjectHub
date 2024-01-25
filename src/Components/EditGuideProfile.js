// EditGuideProfile.js

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

const EditGuideProfile = ({ onEditDone }) => {
  const [open, setOpen] = useState(true);
  const [readOnlyInteraction, setReadOnlyInteraction] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    designation: "",
    branch: "",
    email: "",
    collegeId: "",
    city: "",
    state: "",
    country: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    publications: [], // Added field for Selected Publications
    teachingInterest: [], // Added field for Teaching Interest
    researchAreas: [], // Added field for Research Areas
    // Add other fields as needed
  });
  
  const { user } = useAuth();
  const userId = user.uid;

  useEffect(() => {
    const userDocRef = doc(firestore, "Faculties", userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserData(userData);
      } else {
        console.error("Guide not found");
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

  const handleSubmit = async () => {
    try {
      const userDocRef = doc(firestore, "Faculties", userId);
      await updateDoc(userDocRef, userData);
  
      // Update other collections if needed
  
      toast.success("Guide data updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating guide data:", error);
      toast.error("Error updating guide data. Please try again.");
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
                label="Full Name"
                variant="outlined"
                fullWidth
                value={userData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Designation"
                variant="outlined"
                fullWidth
                value={userData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
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
                label="Email"
                variant="outlined"
                fullWidth
                value={userData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="College ID"
                variant="outlined"
                fullWidth
                value={userData.collegeId}
                onChange={(e) => handleChange("collegeId", e.target.value)}
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
            <Grid item xs={12}>
            <TextField
              label="Selected Publications"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={userData.publications ? userData.publications.join("\n") : ""}
              onChange={(e) => handleChange("publications", e.target.value.split("\n"))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teaching Interest"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={userData.teachingInterest ? userData.teachingInterest.join("\n") : ""}
              onChange={(e) => handleChange("teachingInterest", e.target.value.split("\n"))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Research Areas"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={userData.researchAreas ? userData.researchAreas.join("\n") : ""}
              onChange={(e) => handleChange("researchAreas", e.target.value.split("\n"))}
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

export default EditGuideProfile;
