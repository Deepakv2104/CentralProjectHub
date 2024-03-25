import React, { useState, useEffect } from "react";
import { Paper, Grid, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Send } from '@mui/icons-material';
import { getFirestore, collection, doc, getDoc, query, onSnapshot, addDoc, where } from "firebase/firestore";
import { useAuth } from "./Authentication/auth-context";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentComponent = () => {
  const auth = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [matchingGroup, setMatchingGroup] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [unsubscribeGroup, setUnsubscribeGroup] = useState(() => {});
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentData, setStudentData] = useState([]);
  useEffect(() => {
    if (auth.user) {
      setCurrentUserId(auth.user.uid);
    }
  }, [auth.user]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, "students");
  
        // Fetch details of the current user
        const userDocRef = doc(usersCollection, currentUserId);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
       setStudentData(userData);
        // If the user is part of a group, fetch group details
        if (userData.groupId) {
          const groupsCollection = collection(db, "groups");
          const groupDocRef = doc(groupsCollection, userData.groupId);
          const groupDocSnapshot = await getDoc(groupDocRef);
          const groupData = groupDocSnapshot.data();
  
          // Set both user and group details in the state
          setMatchingGroup(groupData);
          console.log(groupData)
        } else {
          console.log("User is not part of any group.");
        }
      } catch (error) {
        console.error("Error fetching user or group details:", error);
      }
    };
  
    if (currentUserId) {
      fetchGroup();
    }
  
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeGroup) {
        unsubscribeGroup();
      }
    };
  }, [currentUserId]);
  
  const handleAssignmentSubmit = async () => {
    try {
      const db = getFirestore();
      const assignmentsCollection = collection(db, 'assignments');

      const newAssignment = {
        groupId: matchingGroup?.groupId || '',
        assignmentTitle,
        assignmentDeadline,
        submissionDate: new Date(),
        status: 'Submitted',
        studentId: currentUserId,
      };

      const assignmentDocRef = await addDoc(assignmentsCollection, newAssignment);
      setSelectedAssignment({
        id: assignmentDocRef.id,  // Make sure to set the id here
        ...newAssignment,
      });

      // Reset assignment details
      setAssignmentTitle('');
      setAssignmentDeadline('');

      toast.success('Assignment submitted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500, // Set the duration in milliseconds
      });
    } catch (error) {
      toast.error('Error submitting assignment. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      console.error('Error submitting assignment:', error);
    }
  };
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

    if (matchingGroup && matchingGroup.students) {
      const studentsArray = matchingGroup.students;
      fetchStudentDetails(studentsArray);
    }
  }, [matchingGroup]);
  const handleCommentSubmit = async () => {
    try {
      const db = getFirestore();
      const commentsCollection = collection(db, 'comments');

      const newComment = {
        groupId: matchingGroup?.groupId || '',
        assignmentId: selectedAssignment?.id || '',
        userId: currentUserId,
        userName: studentData,
        profile: studentData.profilePic, // Assuming student profile is not available
        message: updateMessage,
        timestamp: new Date(),
      };

      await addDoc(commentsCollection, newComment);
      setUpdateMessage('');

      toast.success('Comment submitted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500, // Set the duration in milliseconds
      });
    } catch (error) {
      toast.error('Error adding comment. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      console.error('Error adding comment:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const db = getFirestore();
      const commentsCollection = collection(db, 'comments');

      // Use onSnapshot to listen for real-time updates
      const unsubscribe = onSnapshot(
        query(commentsCollection, where('groupId', '==', matchingGroup?.groupId || '')),
        (snapshot) => {
          const commentsData = snapshot.docs.map((doc) => doc.data());
          setComments(commentsData);
        }
      );

      // Save the unsubscribe function for later cleanup
      setUnsubscribeGroup(() => unsubscribe);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (matchingGroup) {
      fetchComments();
    }
  }, [matchingGroup]);

  useEffect(() => {
    const fetchPreviousAssignments = async () => {
      try {
        const db = getFirestore();
        const assignmentsCollection = collection(db, 'assignments');

        // Use onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(
          query(assignmentsCollection, where('groupId', '==', matchingGroup?.groupId || ''), where('studentId', '==', currentUserId)),
          (snapshot) => {
            const assignmentsData = snapshot.docs.map((doc) => ({
              id: doc.id,  // Make sure to set the id here
              ...doc.data(),
            }));
            setSubmittedAssignments(assignmentsData);
          }
        );

        // Save the unsubscribe function for later cleanup
        setUnsubscribeGroup(() => unsubscribe);
      } catch (error) {
        console.error('Error fetching previous assignments:', error);
      }
    };

    if (matchingGroup) {
      fetchPreviousAssignments();
    }

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribeGroup) {
        unsubscribeGroup();
      }
    };
  }, [matchingGroup, currentUserId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Submit Assignment
          </Typography>
          <TextField
            fullWidth
            label="Assignment Title"
            variant="outlined"
            margin="normal"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            label="Assignment Deadline"
            value={assignmentDeadline}
            onChange={(e) => setAssignmentDeadline(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignmentSubmit}
          >
            Submit Assignment
          </Button>
        </Paper>

        {submittedAssignments.length > 0 &&
          submittedAssignments.map((assignment, index) => (
            <Paper
              key={index}
              elevation={3}
              style={{ padding: "20px", marginTop: "20px", position: "relative" }}
            >
              <List>
                <ListItem button>
                  <ListItemText
                    primary={assignment.assignmentTitle}
                    secondary={`Deadline: ${assignment.assignmentDeadline}`}
                  />
                </ListItem>
              </List>
            </Paper>
          ))}

        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>
          <List>
            <TextField
              fullWidth
              label="Add comment"
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
              Send
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

    {/* Right side for updates and comments */}
<Grid item xs={4} style={{ padding: "20px" }}>
  <Paper elevation={3} style={{ padding: "20px" }}>
    <Typography variant="h5" gutterBottom>
      {matchingGroup && matchingGroup.groupName ? (
        matchingGroup.groupName
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
  );
};

export default StudentComponent;
