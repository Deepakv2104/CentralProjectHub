import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import Loop from '@mui/icons-material/Loop';
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { makeStyles } from "@mui/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TableSortLabel } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import intToRoman from "../RomanNo";
import CircularProgress from "@mui/material/CircularProgress";
const useStyles = makeStyles({
  tableContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "15px",
    marginRight: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowX: "auto",
    maxWidth: "1210px",
    marginBottom: "20px",
  },
  tableHeadCell: {
    fontWeight: "bold",
    backgroundColor: "#273656",
    position: "sticky",
    top: 0,
    cursor: "pointer",
  },

  tableHeadText: {
    color: "white",
    "&:hover": {
      color: "#c0392b",
    },
  },

  tableRow: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#f0f0f0",
    },
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "75px",
    marginLeft: "15px",
    marginRight: "10px",
    maxWidth: "1210px",
    background: "#f5f5f5",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  filterInput: {
    marginLeft: "15px",
   
  },
});
const ProjectTable = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { branchName } = useParams();
  const [projects, setProjects] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [filterYear, setFilterYear] = useState(""); // New state for year filter
  const [filterSection, setFilterSection] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const projectsCollectionRef = collection(db, "projects");
      const q = query(projectsCollectionRef, where("branch", "==", branchName));
      const querySnapshot = await getDocs(q);

      const data = [];

      for (const doc of querySnapshot.docs) {
        const projectData = {
          id: doc.id,
          ...doc.data(),
        };

        // Check if studentId is available before fetching rollNo
        if (projectData.userId) {
          const studentDetails = await fetchStudentDetails(projectData.userId);
          console.log(studentDetails);
          // Set rollNo and year in project data
          projectData.rollNo = studentDetails.rollNo;
          projectData.year = studentDetails.year;
          projectData.section = studentDetails.section;
          console.log(
            "Section for project",
            projectData.id,
            ":",
            projectData.section
          );
        } else {
          console.log("No student id provided for project:", projectData.id);
          projectData.rollNo = "N/A";
          projectData.year = "N/A";
          projectData.section = "N/A";
        }

        data.push(projectData);
      }

      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchStudentDetails = async (studentId) => {
    try {
      if (!studentId) {
        console.log("No studentId provided");
        return { rollNo: "N/A", year: "N/A", section: "N/A" };
      }

      const db = getFirestore();
      const studentDocRef = doc(db, "students", studentId);
      const studentDocSnapshot = await getDoc(studentDocRef);

      if (studentDocSnapshot.exists()) {
        const studentData = studentDocSnapshot.data();
        return {
          rollNo: studentData.rollNo,
          year: studentData.year,
          section: studentData.section,
        };
      } else {
        console.log("Student document not found");
        return { rollNo: "N/A", year: "N/A", section: "N/A" };
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      return { rollNo: "N/A", year: "N/A", section: "N/A" };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [branchName]);

  const handleResetFilters = () => {
    setFilterText('');
    setFilterYear('');
    setFilterSection('');
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleFilter = (text) => {
    setFilterText(text);
  };

  const handleCellClick = (projectId) => {
    navigate(`${projectId}`);
  };
  const handleYearFilter = (event) => {
    setFilterYear(event.target.value);
  };

  const handleSectionFilter = (event) => {
    setFilterSection(event.target.value);
  };
  const sortedProjects = [...projects].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const filteredProjects = sortedProjects.filter((project) => {
    const isYearMatch = filterYear === "" || project.year === filterYear; // Check if year matches or if no year filter selected
    const isSectionMatch =
      filterSection === "" || project.section === filterSection; // Check if section matches or if no section filter selected

    return (
      isYearMatch &&
      isSectionMatch &&
      Object.values(project).some(
        (value) =>
          value !== undefined &&
          value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  });

  const columns = [
    { key: "projectName", label: "Project Name" },
    { key: "description", label: "Description" },
    { key: "domain", label: "Domain" },
    { key: "github", label: "GitHub" },
    { key: "appLink", label: "App Link" },
    { key: "rollNo", label: "Roll No." },
    { key: "year", label: "Year" },
    { key: "section", label: "Section" },
    { key: "submittedOn", label: "Date" },
  ];

  return (
    <div>
      <div className={classes.filterContainer}>
        <TextField
          className={classes.filterInput}
          label="Search"
          variant="outlined"
          size="small"
          value={filterText}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Select
          className={classes.filterInput}
          label="Filter by Year"
          variant="outlined"
          size="small"
          value={filterYear}
          onChange={handleYearFilter}
          displayEmpty
        >
          <MenuItem disabled value="">
            Select Year
          </MenuItem>
          <MenuItem value="I">I</MenuItem>
          <MenuItem value="II">II</MenuItem>
          <MenuItem value="III">III</MenuItem>
          <MenuItem value="IV">IV</MenuItem>
        </Select>
        <Select
          className={classes.filterInput}
          label="Filter by Section"
          variant="outlined"
          size="small"
          value={filterSection}
          onChange={handleSectionFilter}
          displayEmpty
        >
          <MenuItem disabled value="">
            Select Section
          </MenuItem>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          {/* Add more sections as needed */}
        </Select>
        <IconButton
          color="primary"
          onClick={handleResetFilters}
          style={{ marginLeft: '15px' }}
        >
          <Loop />
        </IconButton>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key} className={classes.tableHeadCell}>
                    <TableSortLabel
                      active={sortConfig.key === column.key}
                      direction={
                        sortConfig.key === column.key
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSort(column.key)}
                    >
                      <span className={classes.tableHeadText}>
                        {column.label}
                      </span>
                      {sortConfig.key === column.key && (
                        <ArrowUpwardIcon fontSize="small" />
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className={classes.tableRow}
                  onClick={() => handleCellClick(project.id)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === "github" && project[column.key] ? (
                        <IconButton
                          href={project[column.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHubIcon />
                        </IconButton>
                      ) : column.key === "appLink" && project[column.key] ? (
                        <IconButton
                          href={project[column.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon />
                        </IconButton>
                      ) : // Check if the column key is "rollNo", "year", or "section" and display it
                      column.key === "rollNo" ||
                        column.key === "year" ||
                        column.key === "section" ? (
                        project[column.key]
                      ) : (
                        // Display the data as plain text
                        project[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ProjectTable;
