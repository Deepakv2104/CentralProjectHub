import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  InputAdornment,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import { Send, AttachFile, InsertLink, VideoLibrary,YouTube} from '@material-ui/icons';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
addDoc
} from "firebase/firestore";
import { useAuth } from "../Authentication/auth-context";

const ClassroomComponent = () => {
  const auth = useAuth();
  const { projectType, section } = useParams();
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [attachment, setAttachment] = useState('');
   const [currentUserId, setCurrentUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const[studentIds, setStudentIds] = useState([]);
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [students, setStudents] = useState([
    { id: 1, name: "Student One", avatar: "S1" },
    { id: 2, name: "Student Two", avatar: "S2" },
    { id: 3, name: "Student Three", avatar: "S3" },
    // Add more students as needed
  ]);

  useEffect(() => {
    if (auth.user) {
      // Assuming your auth.user object has a uid property
      setCurrentUserId(auth.user.uid);
      console.log(currentUserId,"is current user")
    }
  }, [auth.user]);

  // useEffect(() => {
  //   const fetchStudentDetails = async (studentIds) => {
  //     const db = getFirestore();
  //     const studentsCollection = collection(db, "students");
  
  //     const studentDetailsPromises = studentIds.map(async (studentId) => {
  //       const studentDocRef = doc(studentsCollection, studentId);
  
  //       try {
  //         const studentDocSnapshot = await getDoc(studentDocRef);
  
  //         if (studentDocSnapshot.exists()) {
  //           const studentData = studentDocSnapshot.data();
  //           console.log(`Fetched student ID: ${studentId}, Data:`, studentData);
  //           return studentData;
  //         } else {
  //           console.error(`Student with ID ${studentId} not found.`);
  //           return null;
  //         }
  //       } catch (error) {
  //         console.error(`Error fetching student with ID ${studentId}:`, error);
  //         return null;
  //       }
  //     });
  
  //     const studentDetails = await Promise.all(studentDetailsPromises);
  //     console.log("All student details:", studentDetails);
  //     setStudentDetails(studentDetails.filter((student) => student !== null));
  //   };
  
  //   if (matchingGroups.length > 0) {
  //     const studentIds = matchingGroups[0].students;
  //     console.log("Fetching details for student IDs:", studentIds);
  //     fetchStudentDetails(studentIds);
  //   }
  // }, [matchingGroups]);
  
  useEffect(() => {
    // This effect will run whenever matchingGroups changes
    console.log("Matching Groups changed:", matchingGroups);
  
    // Access students array inside matchingGroups
    if (matchingGroups.length > 0) {
      const studentsArray = matchingGroups[0].students;
      console.log("Students inside matchingGroups:", studentsArray);
      
      // Now, you can do further processing with the studentsArray if needed
    }
  }, [matchingGroups]);
  
  useEffect(() => {
    const fetchStudentDetails = async (studentIds) => {
      const db = getFirestore();
      const studentsCollection = collection(db, 'students');
  
      const studentDetailsPromises = studentIds.map(async (studentId) => {
        const studentDocRef = doc(studentsCollection, studentId);
        const studentDocSnapshot = await getDoc(studentDocRef);
  
        if (studentDocSnapshot.exists()) {
          const studentData = {
            id: studentId,
            ...studentDocSnapshot.data(),
          };
          console.log(`Fetched student ID: ${studentId}, Data:`, studentData);
          return studentData;
        } else {
          console.error(`Student with ID ${studentId} not found.`);
          return null;
        }
      });
  
      const studentDetails = await Promise.all(studentDetailsPromises);
      console.log("All student details:", studentDetails);
      setStudentDetails(studentDetails.filter((student) => student !== null));
    };
  
    if (matchingGroups.length > 0) {
      const studentsArray = matchingGroups[0].students;
      console.log("Fetching details for student IDs:", studentsArray);
      fetchStudentDetails(studentsArray);
    }
  }, [matchingGroups]);
  
  

  useEffect(() => {
    const db = getFirestore();
  
    const fetchGroups = async () => {
      try {
        // Fetch groups where guideId is equal to the currentUserId
        const groupsSnapshot = await getDocs(
          query(collection(db, "groups"), where("guideId", "==", currentUserId))
        );
  
        const groupsData = groupsSnapshot.docs.map((doc) => doc.data());
        console.log("Fetched groups data:", groupsData);
  
        // Access projectType and section from useParams
       
  
        // Compare with the data from groupsData
        const matchingGroups = groupsData.filter((group) => {
          return group.projectType === projectType && group.section === section;
        });


        setMatchingGroups(matchingGroups);
        console.log("Matching Groups:", matchingGroups);
  
     
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
  
    fetchGroups();
  }, [currentUserId, useParams]); // Include currentUserId and useParams as dependencies
   // Include currentUserId as a dependency
  
  const handleAttachmentChange = (e) => {
    setAttachment(e.target.value);
  };

  const handleAssignmentSubmit = () => {
    // Handle assignment submission logic
    // You can add your backend integration here

    // For demonstration, we'll update the submittedAssignments state
    const newAssignment = {
      student: "Student X",
      assignment: assignmentTitle,
      submission: "Submitted on " + new Date().toLocaleDateString(),
      status: "Submitted",
    };

    setSubmittedAssignments((prevAssignments) => [
      ...prevAssignments,
      newAssignment,
    ]);
    setAssignmentTitle("");
    setAssignmentDeadline("");
  };

  const handleCommentSubmit = () => {
    // Handle comment submission logic
    // You can add your backend integration here

    // For demonstration, we'll update the comments state
    const newComment = {
      student: "Student Y",
      message: updateMessage,
    };

    setComments((prevComments) => [...prevComments, newComment]);
    setUpdateMessage("");
  };

  const handleAssignmentClick = (assignment) => {
    // Handle assignment click logic (e.g., show details, navigate to assignment page)
    setSelectedAssignment(assignment);
  };

  return (
    <div>
      <Grid container spacing={3}>
        {/* Left side for classwork */}
        <Grid item xs={8}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            {/* Add Assignment Section */}
            <Typography variant="h5" gutterBottom>
              Add Weekly Progress 
            </Typography>
            <TextField
            fullWidth
            label="Assignment Title"
            variant="outlined"
            margin="normal"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            multiline  // Allow multiline input
            rows={4}    // Adjust the number of rows as needed
            InputProps={{
              style: {
                height: '100px', // Adjust the height as needed
              },
              endAdornment: (
                <InputAdornment position="end">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton aria-label="attach file" onClick={() => console.log('Attach File')}>
                      <FileUploadIcon />
                    </IconButton>
                    <IconButton aria-label="insert link" onClick={() => console.log('Insert Link')}>
                      <InsertLink />
                    </IconButton>
                    <IconButton aria-label="video library" onClick={() => console.log('Video Library')}>
                      <YouTube />
                    </IconButton>
                  </div>
                </InputAdornment>
              ),
            }}
          />
           <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            label="Report Deadline"
            value={assignmentDeadline}
            onChange={(e) => setAssignmentDeadline(e.target.value)}
          />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignmentSubmit}
            >
             Post
            </Button>
          </Paper>

          {/* Separate Paper for Submitted Assignments Section */}
          {submittedAssignments.length > 0 &&
            submittedAssignments.map((assignment, index) => (
              <Paper
                key={index}
                elevation={3}
                style={{ padding: "20px", marginTop: "20px" }}
              >
                
                <List>
                  <ListItem
                    button
                   
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <AttachFile />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${assignment.student} posted a new work ${assignment.assignment}`}
                      secondary={
                        <>
                          {assignment.submission} ({assignment.status})
                        </>
                      }
                    />
                  </ListItem>
                 
                </List>
              </Paper>
            ))}
               <Grid item xs={12}>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <List>
          <TextField
            fullWidth
            label="Add class comment"
            variant="outlined"
            margin="normal"
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={handleCommentSubmit}
          >
            send
          </Button>
          {comments.map((comment, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{comment.student.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.student}
                  secondary={comment.message}
                />
              </ListItem>
              {index < comments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Grid>
        </Grid>

       {/* Right side for updates and comments */}
<Grid item xs={4} style={{ padding: "20px" }}>
  <Paper elevation={3} style={{ padding: "20px" }}>
  <Typography variant="h5" gutterBottom>
  {matchingGroups.length > 0 ? (
    matchingGroups[0].groupName
  ) : (
    "No matching groups found"
  )}
</Typography>

<List>
  {studentDetails.map((student, index) => (
    <React.Fragment key={student.id}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
        <Avatar
    alt={student.name}
    src={student.profilePic}
    style={{ width: '60px', height: '60px' }}
  />
        </ListItemAvatar>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
          <ListItemText primary={student.name} />
          <ListItemText secondary={student.rollNo} />
        </div>
      </ListItem>
      {index < studentDetails.length - 1 && <Divider />}
    </React.Fragment>
  ))}
</List>



  </Paper>
</Grid>


        {/* Assignment Details Section */}
        {selectedAssignment && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
              <Typography variant="h5" gutterBottom>
                Assignment Details - {selectedAssignment.assignment}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Student: {selectedAssignment.student}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Submission: {selectedAssignment.submission}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {selectedAssignment.status}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ClassroomComponent;
