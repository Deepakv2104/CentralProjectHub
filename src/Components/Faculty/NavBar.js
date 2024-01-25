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
  useMediaQuery,
  TextField,
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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../Authentication/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import Popover from "@material-ui/core/Popover";
import { messaging } from "../../firebase/firebase";
import { onMessage , getToken} from "firebase/messaging";
const drawerWidth = 240;

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
    [theme.breakpoints.down("sm")]: {
      display: "none", // Hide search in mobile view
    },
  },
}));

const NavBar = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [fullName, setfullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const userId = user ? user.uid : null;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.log("User not logged in");
          return;
        }

        const userDocRef = doc(firestore, "Faculties", userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setfullName(userData.fullName || "");
          setDesignation(userData.designation || "");
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

  // Open the notification dropdown
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Close the notification dropdown
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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

  const notificationContent = (
    <div style={{ width: "300px", padding: "16px" }}>
      <List>
        {/* Iterate over real-time notifications received from FCM */}
        {notifications.map((notification, index) => (
          <ListItem key={index}>
            <ListItemText primary={notification.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  const isMobile = useMediaQuery("(max-width:600px)");
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
            {isMobile ? null : (
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
            )}
            {/* Notification Icon */}
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={3} color="secondary" overlap="rectangular">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover
              open={Boolean(notificationAnchorEl)}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {notificationContent}
            </Popover>
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
          {fullName || "NA"}
        </Typography>
        <Typography variant="h6" align="center" className="username">
          {designation || "NA"}
        </Typography>
        <List>
          <ListItem>
            <Button
              onClick={() => navigate("/admin-dashboard/explore")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Explore" />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate("/admin-dashboard/apprentice")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Apprentice" />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate("/admin-dashboard/form-group")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <GroupAddIcon />
              </ListItemIcon>
              <ListItemText primary="Group" />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate("/admin-dashboard/requests")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <AttachEmailIcon />
              </ListItemIcon>
              <ListItemText primary="Requests" />
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => navigate(`/admin-dashboard/profile/${userId}`)}
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <ListItemIcon>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
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
              <ListItemText primary="Logout" />
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

export default NavBar;
