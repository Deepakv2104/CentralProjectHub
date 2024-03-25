import React, { useState, useEffect } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  Button,
  ListItemIcon,
  ListItemText,
  Typography,
  InputBase,
  Badge,
} from "@material-ui/core";
import { useNavigate, Outlet } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import ProfileAvatar from "../ProfileAvatar";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import SchoolIcon from "@mui/icons-material/School";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useAuth } from "../Authentication/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import WorkspacesIcon from '@mui/icons-material/Workspaces';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "#161a30",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#fff",
    color: "black",
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  rightSection: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const StudentNavbar = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const userId = user ? user.uid : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.log("User not logged in");
          return;
        }

        const userDocRef = doc(firestore, "students", userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setName(userData.name || "");
          setRollNo(userData.rollNo || "");
        } else {
          console.log("User document not found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();

      toast.success("Logout successful!", {
        position: "top-right",
        autoClose: 1200,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      navigate("/home");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className={classes.root}>
      {/* Navbar */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <div className="logo-text">ANURAG UNIVERSITY</div>
          {/* Right Section */}
          <div className={classes.rightSection}>
            {/* Search Bar */}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            {/* Notification Icon */}
            <IconButton color="inherit">
              <Badge
                badgeContent={3}
                color="secondary"
                overlap="rectangular"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {/* Sidebar */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
        </div>
        <div className="avatar-container">
          <ProfileAvatar />
        </div>
        <Typography variant="h6" align="center" className="username">
          {name || "NA"}
        </Typography>
        <Typography variant="h6" align="center" className="username">
          {rollNo || "NA"}
        </Typography>
        <List>
          <ListItem>
            <Button
              onClick={() => navigate("/student-dashboard/explore")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Explore" style={{ textTransform: 'none' }} />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate("/student-dashboard/add-project")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Add Project" style={{ textTransform: 'none' }}/>
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate("/student-dashboard/guide")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <GroupAddIcon />
              </ListItemIcon>
              <ListItemText primary="Guide" style={{ textTransform: 'none' }}/>
            </Button>
          </ListItem>
           <ListItem>
            <Button
              onClick={() => navigate("/student-dashboard/workspace")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <WorkspacesIcon/>
              </ListItemIcon>
              <ListItemText primary="Workspace" style={{ textTransform: 'none' }} />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate(`/student-dashboard/student-profile/${userId}`)}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <AttachEmailIcon />
              </ListItemIcon>
              <ListItemText primary="Profile"  style={{ textTransform: 'none' }}/>
            </Button>
          </ListItem>
        
          <ListItem>
            <Button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" style={{ textTransform: 'none' }}/>
            </Button>
          </ListItem>
        </List>
      </Drawer>
      {/* Main content */}
      <div
        className={`${classes.content} ${
          open ? classes.contentShift : ""
        } main-content`}
      >
        {children}
      </div>
    </div>
  );
};

export default StudentNavbar;
