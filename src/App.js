import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";
import Blog from "./Pages/Blog";
import Dashboard from "./Pages/Dashboard";
import ProjectSubmission from "./Components/Projects/AddProject";
import ResearchPaper from "./Components/ResearchPaper";
import Settings from "./Components/Settings";
// import CardComponent from "./Components/Card";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NewCard from "./Components/Profile.js";
import ProfilePage from "./Components/ProfileCard";
import ProfileCarousel from "./Components/ProfileCarousel.js";
import MyProjects from "./Components/Projects/MyProjects.js";
import Explore from "./Components/Explore.js";
import ProjectsByBranch from "./Components/Projects/ProjectsByBranch.js";
// import LoginPage from "./Components/Authentication/LoginPage.js";
import SingleProjectCard from "./Components/Projects/SingleProject.js";
import ProjectTable from "./Components/Projects/ProjectsByBranch.js";
import LoginCard from "./Components/Authentication/Login.js";
import ProportionedGridComponent from "./Components/Profile.js";
import Profile from "./Components/Profile.js";
import ViewProjects from "./Components/Projects/ViewProjects.js";
const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <Routes>
  
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginCard />} />
            <Route path="/student-dashboard" element={<Dashboard />}>
            <Route path="/student-dashboard/profile" element={<Profile />}/>
              <Route path="/student-dashboard/explore" element={<Explore />} />
              <Route path="/student-dashboard/explore/:branchName" element={<ProjectTable />} />
              <Route path="/student-dashboard/explore/:branchName/:projectId" element={<SingleProjectCard />} />
              <Route path= "/student-dashboard/explore/top-contributors/"  element={<Profile/>} />
      
              <Route path="/student-dashboard/add-project" element={<MyProjects/>} />
              <Route path="/student-dashboard/add-project/:projectId" element={<SingleProjectCard/>} />
              <Route path="/student-dashboard/add-project/:projectId/:studentId" element={<Profile/>} />
              {/* <Route path="/student-dashboard/add-project/:projectId/:profileId" element={<ProportionedGridComponent/>} /> */}
             
              <Route path="/student-dashboard/explore/:branchName/:projectId/:studentId" element={<Profile/>} />
              <Route path="/student-dashboard/profile/:studentId/" element={<Profile/>} />

              <Route path="/student-dashboard/profile/:studentId/projects" element={<ViewProjects/>} />
              <Route path="/student-dashboard/profile/:studentId/projects/:projectId" element={<SingleProjectCard/>} />
              <Route path="/student-dashboard/profile/:studentId/projects/:projectId" element={<SingleProjectCard/>} />
              <Route path="/student-dashboard/blog" element={<About />} />
              <Route path="/student-dashboard/research-paper" element={<About />} />
              <Route path="/student-dashboard/settings" element={<About />} />
            </Route>

            {/* Add the LoginPage route */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
          
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
           
          
            {/* Handle 404 */}
         
          </Routes>
        </div>
      </Router>
      </ThemeProvider>
  );
};

export default App;
