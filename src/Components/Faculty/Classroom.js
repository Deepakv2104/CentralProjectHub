import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  onSnapshot,
  deleteDoc,
addDoc
} from "firebase/firestore";
import { useAuth } from "../Authentication/auth-context";
import DeleteIcon from '@material-ui/icons/Delete';

const ClassroomComponent = () => {
  const auth = useAuth();
  const { projectType, section } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [unsubscribeGroups, setUnsubscribeGroups] = useState(() => {});
  const [facultyDetails, setFacultyDetails] = useState({});


  useEffect(() => {
    if (auth.user) {
      setCurrentUserId(auth.user.uid);
    }
  }, [auth.user]);

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const db = getFirestore();
        const facultiesCollection = collection(db, 'Faculties');
        const facultyDocRef = doc(facultiesCollection, currentUserId);
        const facultyDocSnapshot = await getDoc(facultyDocRef);
  
        if (facultyDocSnapshot.exists()) {
          const facultyData = facultyDocSnapshot.data();
          setFacultyDetails(facultyData);
        } else {
          console.error(`Faculty with ID ${currentUserId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching faculty details:', error);
      }
    };
  
    if (currentUserId) {
      fetchFacultyDetails();
    }
  }, [currentUserId]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const db = getFirestore();
        const groupsCollection = collection(db, "groups");
        console.log(projectType)
  
        // Use onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(
          query(groupsCollection, where("guideId", "==", currentUserId)),
          (snapshot) => {
            const groupsData = snapshot.docs.map((doc) => doc.data());
            const matchingGroups = groupsData.filter(
              (group) => group.projectType === projectType && group.section === section
            );
  
            setMatchingGroups(matchingGroups);
            console.log(matchingGroups, 'matching grougps');
          }
        );
  
        // Save the unsubscribe function for later cleanup
        setUnsubscribeGroups(() => unsubscribe);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
  
    fetchGroups();
  
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeGroups) {
        unsubscribeGroups();
      }
    };
  }, [currentUserId, projectType, section]);

  useEffect(() => {
    const fetchStudentDetails = async (studentIds) => {
      try {
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
            return studentData;
          } else {
            console.error(`Student with ID ${studentId} not found.`);
            return null;
          }
        });

        const studentDetails = await Promise.all(studentDetailsPromises);
        setStudentDetails(studentDetails.filter((student) => student !== null));
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    if (matchingGroups.length > 0) {
      const studentsArray = matchingGroups[0].students;
      fetchStudentDetails(studentsArray);
    }
  }, [matchingGroups]);

 const handleWorkAssigned = async () => {
  try {
    const db = getFirestore();
    const assignmentsCollection = collection(db, 'assignments');

    const newAssignment = {
      
      groupId: matchingGroups[0]?.groupId ,
      
      assignmentTitle,
      assignmentDeadline,
      submissionDate: new Date(),
      status: 'Submitted',
      guideId: currentUserId,
    };
    

    const assignmentDocRef = await addDoc(assignmentsCollection, newAssignment);
    setSelectedAssignment({
      id: assignmentDocRef.id,  // Make sure to set the id here
      ...newAssignment,
    });
 // Reset assignment details
 setAssignmentTitle('');
 setAssignmentDeadline('');

 toast.success('Assignment added successfully', {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 1500, // Set the duration in milliseconds
});
    // Rest of your code...
  } catch (error) {
    toast.error('Error adding assignment. Please try again.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
    console.error('Error adding assignment:', error);
  }
};


  const handleCommentSubmit = async () => {
    try {
      console.log('groupId:', matchingGroups[0]?.groupId);
      console.log('assignmentId:', selectedAssignment?.id);
  
      const db = getFirestore();
      const commentsCollection = collection(db, 'comments');
  
      const newComment = {
        groupId: matchingGroups[0]?.groupId || '',
        assignmentId: selectedAssignment?.id || '',
        userId: currentUserId,
        userName: facultyDetails.fullName,
        profile: facultyDetails.profilePic,
        message: updateMessage,
        timestamp: new Date(),
      };
  
      await addDoc(commentsCollection, newComment);
      setUpdateMessage('');
      toast.success('Comment submitted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500, // Set the duration in milliseconds
      });
      console.log('Submitting comment...');
    } catch (error) {
      toast.error('Error adding comment. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      console.error('Error adding comment:', error);
    }
  };
  const fetchComments = async () => {
    console.log('insdie fetch groupId:', matchingGroups[0]?.groupId);
  
    try {
      const db = getFirestore();
      const commentsCollection = collection(db, 'comments');
      
      // Use onSnapshot to listen for real-time updates
      const unsubscribe = onSnapshot(
        query(commentsCollection, where('groupId', '==', matchingGroups[0]?.groupId || '')),
        (snapshot) => {
          const commentsData = snapshot.docs.map((doc) => doc.data());
          console.log('Fetched Comments:', commentsData);
          setComments(commentsData);
        }
      );
  
      // Save the unsubscribe function for later cleanup
      setUnsubscribeGroups(() => unsubscribe);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  
  useEffect(() => {
    fetchComments();
  }, [matchingGroups]);
  
  useEffect(() => {
    const fetchPreviousAssignments = async () => {
      try {
        const db = getFirestore();
        const assignmentsCollection = collection(db, 'assignments');
    
        // Use onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(
          query(assignmentsCollection, where('groupId', '==', matchingGroups[0]?.groupId || '')),
          (snapshot) => {
            const assignmentsData = snapshot.docs.map((doc) => ({
              id: doc.id,  // Make sure to set the id here
              ...doc.data(),
            }));
            setSubmittedAssignments(assignmentsData);
          }
        );
    
        // Save the unsubscribe function for later cleanup
        setUnsubscribeGroups(() => unsubscribe);
      } catch (error) {
        console.error('Error fetching previous assignments:', error);
      }
    };
    
  
    if (matchingGroups.length > 0) {
      console.log('Fetching previous assignments...');
      fetchPreviousAssignments();
    }
  
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeGroups) {
        unsubscribeGroups();
      }
    };
  }, [matchingGroups]);
  

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      if (!assignmentId) {
        console.error('Assignment ID is undefined.');
        return;
      }
  
      const db = getFirestore();
      const assignmentsCollection = collection(db, 'assignments');
      const assignmentDocRef = doc(assignmentsCollection, assignmentId);
  
      // Delete the assignment from Firestore
      await deleteDoc(assignmentDocRef);
  
      // Optionally, you can also update the local state to remove the deleted assignment
      setSubmittedAssignments((prevAssignments) =>
        prevAssignments.filter((assignment) => assignment.id !== assignmentId)
      );
      toast.success('Deleted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500, // Set the duration in milliseconds
      });
      console.log(`Assignment with ID ${assignmentId} deleted successfully.`);
    } catch (error) {
      toast.error('Something went wrong.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      console.error('Error deleting assignment:', error);
    }
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
              onClick={handleWorkAssigned}
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
            style={{ padding: "20px", marginTop: "20px", position: "relative" }}
          >
            {/* Delete icon in the top right corner */}
            <IconButton
  aria-label="delete assignment"
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    color: "red",
  }}
  onClick={() => handleDeleteAssignment(assignment.id)}
>
  <DeleteIcon />
</IconButton>

            <List>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={facultyDetails.profilePic}  style={{ width: '60px', height: '60px' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                      {assignment.assignmentTitle}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {facultyDetails.fullName}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary">
                        {`Deadline: ${assignment.assignmentDeadline}`}
                      </Typography>
                    </React.Fragment>
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
                <Avatar   src={comment.profile} >{comment.userName && comment.userName.charAt(0)}</Avatar>

                </ListItemAvatar>
                <ListItemText
                  primary={comment.userName}
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


 
      </Grid>
    </div>
  );
};

export default ClassroomComponent;
