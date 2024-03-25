// ProportionedGridComponent.js

import React, { useState, useEffect } from "react";
import intToRoman from "./RomanNo";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Link,
} from "@mui/material";
import { Web, GitHub, LinkedIn, Twitter, Language } from "@mui/icons-material";
import ProjectCount from "./ProjectCount";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { Grid, Paper } from "@mui/material";
import ProfileAvatar from "./ProfileAvatar";
import { useAuth } from "./Authentication/auth-context";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import EditProfile from "./EditProfile";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import EditGuideProfile from "./EditGuideProfile";
const GuideProfile = () => {
  const { FacultyId } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const userId = user ? user.uid : null;
  const navigate = useNavigate();


   useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDocRef = doc(firestore, "Faculties", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchFacultyDetails = async () => {
      try {
        console.log("Fetching faculty details for FacultyId:", FacultyId);
        const userDocRef = doc(firestore, "Faculties", FacultyId);
        console.log("User document reference:", userDocRef);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const facultyData = doc.data();
            setUserData(facultyData);
          } else {
            console.log("Faculty document not found for FacultyId:", FacultyId);
          }
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching faculty details:", error);
      }
    };

    // Fetch user data based on authentication if userId is available
    if (userId && !FacultyId) {
      fetchUserData(userId);
    } else if (FacultyId) {
      // Fetch faculty details based on the provided FacultyId
      fetchFacultyDetails(FacultyId);
    } else {
      console.log("User not logged in");
    }
  }, [FacultyId, userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditDone = () => {
    setIsEditing(false);
  };

  const handleClickProjectCount = () => {
    navigate(`/student-dashboard/profile/${FacultyId}/projects`);
  };
  return (
    <div style={{  overflow: "hidden", margin: "0 " }}>
    

     
     {isEditing && <EditGuideProfile onEditDone={handleEditDone} />}

      <Grid container spacing={2} style={{ height: "80%" }}>
        {/* Left Grid (30%) */}
        <Grid item xs={12} md={3}>
          <Grid container spacing={2} style={{ height: "100%" }}>
            {/* Left Top Grid (70% of the left grid) */}
            <Grid item xs={12} style={{ height: "40%" }}>
              <Paper
                style={{
                  height: "84%",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center the content horizontally
                  justifyContent: "center", // Center the content vertically
                }}
              >
                {/* Content for the left top grid */}
                <ProfileAvatar userId={FacultyId} />
                <Typography variant="h6" align="center">
                  {userData.fullName}
                </Typography>
                <Typography variant="h6" align="center" className="username">
                  {userData.designation || "User"}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ height: "100%" }}>
              <Paper style={{ height: "60%", padding: 20 }}>
                {/* Content for the left bottom grid */}
                <h2>Social Links </h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Language sx={{ color: "#4caf50", marginRight: 15 }} />{" "}
                        {/* Globe icon for website */}
                        <Link
                          href={userData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <GitHub sx={{ color: "#333", marginRight: 15 }} />
                        <Link
                          href={userData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <LinkedIn sx={{ color: "#0077b5", marginRight: 15 }} />
                        <Link
                          href={userData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Twitter sx={{ color: "#1da1f2", marginRight: 15 }} />
                        <Link
                          href={userData.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Twitter
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Grid (70%) */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2} style={{ height: "100%" }}>
            {/* Right Top Grid */}
            <Grid item xs={12}>
              {/* Display student details */}
              <Grid container spacing={2} style={{ height: "100%" }}>
                <Grid item xs={6}>
                  <Paper
                    style={{ height: "90%", padding: 20, overflo: "auto" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h2>Faculty Details</h2>
                      {(userId === FacultyId || !FacultyId) && !isEditing && (
                        <IconButton
                          onClick={handleEditClick}
                          style={{
                            color: "blue",
                            fontSize: "14px",
                            padding: "8px 16px",
                            marginLeft: "10px",
                          }}
                        >
                         
                        </IconButton>
                      )}
                    </div>

                    <Grid item xs={12}>
                      <TableContainer style={{ maxHeight: "80%" }}>
                        <Table>
                          <TableBody style={{ height: "60%" }}>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  Name:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.fullName}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  Branch:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.branch}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  E-mail
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.email}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  College ID:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.collegeId}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  City:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.city}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  State:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.state}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  Country:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body1">
                                  {userData.country}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    style={{ height: "90%", padding: 20, overflo: "auto" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h2>Selected Publications</h2>
                      {(userId === FacultyId || !FacultyId) && !isEditing && (
                        <IconButton
                          onClick={handleEditClick}
                          style={{
                            color: "blue",
                            fontSize: "14px",
                            padding: "8px 16px",
                            marginLeft: "10px",
                          }}
                        >
                          <Edit />
                        </IconButton>
                      )}
                    </div>

                    <Grid item xs={12}>
                      <div className="publications">
                        <ul>
                          {Array.isArray(userData.publications) &&
                          userData.publications.length > 0 ? (
                            userData.publications.map(
                              (publication, publicationsIndex) => (
                                <li key={publicationsIndex}>{publication}</li>
                              )
                            )
                          ) : (
                            <li>No publications available</li>
                          )}
                        </ul>
                      </div>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            {/* Right Bottom Grid (divided vertically) */}
            <Grid item xs={12} md={6}>
              <Paper style={{ height: "100%", padding: 20 }}>
                {/* Content for the right bottom left grid */}
                <h2>Teaching Interest</h2>

                <div className="teachingInterest">
                  <ul>
                    {Array.isArray(userData.teachingInterest) &&
                    userData.teachingInterest.length > 0 ? (
                      userData.teachingInterest.map(
                        (teachingInterest, teachingInterestIndex) => (
                          <li key={teachingInterestIndex}>
                            {teachingInterest}
                          </li>
                        )
                      )
                    ) : (
                      <li>No data available</li>
                    )}
                  </ul>
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                style={{ height: "100%", padding: 20 }}
               
              >
                {/* Content for the right bottom right grid */}
                <h2>Research Areas</h2>
                <div className="researchAreas">
                  <ul>
                    {Array.isArray(userData.researchAreas) &&
                    userData.researchAreas.length > 0 ? (
                      userData.researchAreas.map(
                        (researchAreas, researchAreasIndex) => (
                          <li key={researchAreasIndex}>{researchAreas}</li>
                        )
                      )
                    ) : (
                      <li>No data available</li>
                    )}
                  </ul>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default GuideProfile;
