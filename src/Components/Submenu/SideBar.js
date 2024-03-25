import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import ProfileAvatar from "../ProfileAvatar";
import { useAuth } from "../Authentication/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import ExploreIcon from "@mui/icons-material/Explore";
import Edit from "@mui/icons-material/Edit";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import SettingsIcon from "@mui/icons-material/Settings";
// import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import "../../Styles/SideBar.css";
import { Person } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  listItemText: {
    color: theme.palette.text.primary,
  },
  dMSansFont: {
    fontFamily: "DM Sans, sans-serif",
  },
  hideOnMobile: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Sidebar = ({ showSidebar }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user.uid;
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, "students", userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setName(userData.name || "");
          setRollNo(userData.rollNo || "")
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`custom-sidebar ${classes.hideOnMobile} ${showSidebar ? 'show' : ''}`}>
      <div className="avatar-container">
        <ProfileAvatar />
      </div>
      <Typography variant="h6" align="center" className="rollNo">
        {rollNo|| "NA"}
      </Typography>
      <Typography variant="h6" align="center" className="username">
        {name || "User"}
      </Typography>
      <List>
        <ListItem>
          <Button
            onClick={() => navigate("/student-dashboard/explore")}
            style={{ display: "flex", alignItems: "center", color: "inherit" }}
          >
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Explore" className={classes.listItemText} />
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onClick={() => navigate("/student-dashboard/add-project")}
            style={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText
              primary="Add Project"
              className={classes.listItemText}
            />
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onClick={() => navigate("/student-dashboard/guide")}
            style={{ display: "flex", alignItems: "center", color: "inherit" }}
          >
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Guide" className={classes.listItemText} />
          </Button>
        </ListItem>
        <ListItem>
          <Button
            onClick={() => navigate(`/student-dashboard/student-profile/${userId}`)}
            style={{ display: "flex", alignItems: "center", color: "inherit" }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" className={classes.listItemText} />
          </Button>
        </ListItem>
        
      </List>
    </div>
  );
};

export default Sidebar;
