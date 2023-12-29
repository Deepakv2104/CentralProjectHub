import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useAuth } from "../Components/Authentication/auth-context";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";

const DigitBox = ({ digit }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        padding: '10px',
        border: '2px solid #333',
        borderRadius: '8px',
        margin: '5px',
        fontSize: '2rem',
        fontFamily: 'monospace',
        backgroundColor: '#f0f0f0',
        color: '#333',
      }}
    >
      {digit}
    </Box>
  );
};

const ProjectCount = ({ userId: propUserId }) => {
  const [projectCount, setProjectCount] = useState(null);
  const { user } = useAuth();
  const userId = propUserId || user?.uid;

  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        if (!userId) {
          console.error("Invalid userId:", userId);
          return;
        }

        const db = getFirestore();
        const projectsCollection = collection(db, "projects");
        const q = query(projectsCollection, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const count = snapshot.size;
          setProjectCount(count);
        });

        // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching project count from Firebase:", error);
      }
    };

    fetchProjectCount();
  }, [userId]);

  return (
    <div>
      {projectCount !== null ? (
        <Typography variant="h6">
          {projectCount.toString().padStart(2, '0').split('').map((digit, index) => (
            <DigitBox key={index} digit={digit} />
          ))}
        </Typography>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default ProjectCount;
