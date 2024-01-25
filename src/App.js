import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MyProjects from "./Components/Projects/MyProjects.js";
import Explore from "./Components/Explore.js";
import SingleProjectCard from "./Components/Projects/SingleProject.js";
import ProjectTable from "./Components/Projects/ProjectsByBranch.js";
import LoginCard from "./Components/Authentication/Login.js";
import Profile from "./Components/Profile.js";
import ViewProjects from "./Components/Projects/ViewProjects.js";
import GroupingComponent from "./Components/Grouping.js";
import FacultiesGrid from "./Components/Guides.js";
import AdminDashboard from "./Components/Faculty/AdminDashboard.js";
import AssignedStudents from "./Components/Faculty/AssignedStudents.js";
import GuideProfile from "./Components/GuideProfile.js";
import ClassroomComponent from "./Components/Faculty/Classroom.js";
import ApplicationsList from "./Components/Faculty/Applications.js";
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase/firebase.js";
import ProjectByDomain from "./Components/ProjectByDomain.js";

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
              <Route path="/student-dashboard/profile" element={<Profile />} />
              <Route path="/student-dashboard/explore" element={<Explore />} />
              <Route
                path="/student-dashboard/explore/:branchName"
                element={<ProjectTable />}
              />
           
              <Route
                path="/student-dashboard/explore/:branchName/:projectId"
                element={<SingleProjectCard />}
              />
              
              <Route
                path="/student-dashboard/explore/top-contributors/"
                element={<Profile />}
              />

              <Route
                path="/student-dashboard/add-project"
                element={<MyProjects />}
              />
              <Route
                path="/student-dashboard/add-project/:projectId"
                element={<SingleProjectCard />}
              />
              <Route
                path="/student-dashboard/add-project/:projectId/:studentId"
                element={<Profile />}
              />
              {/* <Route path="/student-dashboard/add-project/:projectId/:profileId" element={<ProportionedGridComponent/>} /> */}

              <Route
                path="/student-dashboard/explore/:branchName/:projectId/:studentId"
                element={<Profile />}
              />
              <Route
                path="/student-dashboard/student-profile/:studentId/"
                element={<Profile />}
              />

              <Route
                path="/student-dashboard/student-profile/:studentId/projects"
                element={<ViewProjects />}
              />
              <Route
                path="/student-dashboard/student-profile/:studentId/projects/:projectId"
                element={<SingleProjectCard />}
              />
              <Route
                path="/student-dashboard/guide"
                element={<FacultiesGrid />}
              />
              <Route
                path="/student-dashboard/guide/:FacultyId"
                element={<GuideProfile />}
              />
              <Route path="/student-dashboard/blog" element={<Contact />} />
              <Route
                path="/student-dashboard/research-paper"
                element={<About />}
              />
              <Route
                path="/student-dashboard/settings"
                element={<GroupingComponent numStudents={57} />}
              />
            </Route>

            <Route>
              <Route path="/admin-dashboard" element={<AdminDashboard />}>
                <Route path="/admin-dashboard/explore" element={<Explore />} />
                <Route
                  path="/admin-dashboard/explore/:branchName"
                  element={<ProjectTable />}
                />
                <Route
                  path="/admin-dashboard/explore/:branchName/:projectId"
                  element={<SingleProjectCard />}
                />
                <Route
                  path="/admin-dashboard/explore/:branchName/:projectId/:studentId"
                  element={<Profile />}
                />

                <Route
                  path="/admin-dashboard/apprentice"
                  element={<AssignedStudents />}
                />
                <Route
                  path="/admin-dashboard/apprentice/:projectType/:section"
                  element={<ClassroomComponent />}
                />
                <Route
                  path="/admin-dashboard/form-group"
                  element={<GroupingComponent  />}
                />
                <Route
                  path="/admin-dashboard/requests"
                  element={<ApplicationsList />}
                />
                <Route
                  path="/admin-dashboard/profile/:FacultyId"
                  element={<GuideProfile />}
                />
                <Route
                  path="/admin-dashboard/student-profile/:studentId"
                  element={<Profile />}
                />
                <Route
                  path="/admin-dashboard/student-profile/:studentId/projects"
                  element={<ViewProjects />}
                />
              </Route>
            </Route>

            <Route path="/services" element={<Services />} />
            <Route
              path="/contact"
              element={<GroupingComponent numStudents={57} />}
            />
            <Route path="/about" element={<About />} />

            {/* Handle 404 */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
