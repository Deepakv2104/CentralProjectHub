// StudentDetails.js
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import ProfileAvatar from "../ProfileAvatar";
import { useNavigate } from "react-router-dom";
import ProjectCount from "../ProjectCount";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from "@mui/system";
import { IconButton } from "@mui/material";
import intToRoman from "../RomanNo";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StudentDetails = ({ studentId }) => {

  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        if (!studentId) {
          console.error("Invalid studentId:", studentId);
          return;
        }
        const studentDocRef = doc(firestore, "students", studentId);
        const studentDocSnapshot = await getDoc(studentDocRef);

        if (studentDocSnapshot.exists()) {
          const data = studentDocSnapshot.data();
          setStudentData(data);
        } else {
          console.log("Student document not found");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (!studentData) {
    return null; // You can render a loading spinner or other UI while fetching data
  }

  const handleContainerClick = (studentId) => {
    navigate(`${studentId}`);
    console.log("Clicked on project with projectId:", studentId);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex" }}>
        <ProfileAvatar userId={studentId} />
        <div
          style={{ justifyContent: "center", paddingLeft: 50, paddingTop: 30 }}
        >
          <Typography variant="h7">Student Details:</Typography>

          <Typography variant="h6">
            <strong>Name:</strong> {studentData.name}
          </Typography>
          <Typography variant="h6">
            <strong>Roll No:</strong> {studentData.rollNo}
          </Typography>
        </div>
     
        <div
          style={{ justifyContent: "center", paddingLeft: 50, paddingTop: 30 }}
        >
          <Typography variant="h7">Department:</Typography>

          <Typography variant="h6">
            <strong>{studentData.branch}</strong>
          </Typography>
          <Typography variant="h6">
            <strong>{intToRoman(studentData.year)}</strong>
          </Typography>
        </div>
        <div
          style={{ justifyContent: "center", paddingLeft: 50, paddingTop: 30 }}
        >
          <Typography variant="h7">Section:</Typography>

          <Typography variant="h6">
            <strong>{studentData.section}</strong>
          </Typography>
        </div>
        <div
          style={{ justifyContent: "center", paddingLeft: 50, paddingTop: 30 }}
        >
          Project Count:
          <ProjectCount userId={studentId} />
        </div>
      </div>
      <div>
        <StyledIconButton
          
        
        >
          <RemoveRedEyeIcon />
        </StyledIconButton>
      </div>
    </div>
  );
};

export default StudentDetails;
