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
} from "@mui/material";
import { getFirestore, collection, query, where, getDoc, doc, getDocs } from "firebase/firestore";
import { makeStyles } from "@mui/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TableSortLabel } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: "10px",
    marginLeft: "15px",
    marginRight: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowX: "auto",
    maxWidth: "1210px",
    marginBottom: "20px",
  },
  tableHeadCell: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    position: "sticky",
    top: 0,
    cursor: 'pointer',
  },
  tableRow: {
    "&:hover": {
      cursor: 'pointer',
      backgroundColor: "#f0f0f0",
    },
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: '75px',
    marginLeft: "15px",
    background: "#f5f5f5",
    padding: "10px",
   
    maxWidth: "1210px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  filterInput: {
    marginRight: "10px",
  },
});

const ProjectTable = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { branchName } = useParams();
  const [projects, setProjects] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");
  const [students, setStudents] = useState({});
  const fetchProjects = async () => {
    try {
      const db = getFirestore();
      const projectsCollectionRef = collection(db, "projects");
      const q = query(projectsCollectionRef, where("branch", "==", branchName.toLowerCase()));
      const querySnapshot = await getDocs(q);
  
      const data = querySnapshot.docs.map(async (doc) => {

        const projectData = {

          id: doc.id,
          ...doc.data(),
        };
        console.log(projectData);
        // Check if studentId is available before fetching rollNo
        if (projectData.userId) {
          projectData.rollNo = await fetchRollNo(projectData.userId);
        } else {
          console.log("No student id provided for project:", projectData.id);
          projectData.rollNo = "N/A";
        }
  
        return projectData;
      });
  
      const projectsWithData = await Promise.all(data);
      setProjects(projectsWithData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      // Add any cleanup or additional logic here
    }
  };
  
  const fetchRollNo = async (studentId) => {
    try {
      if (!studentId) {
        console.log("No studentId provided");
        return "N/A";
      }
  
      const db = getFirestore();
      const studentDocRef = doc(db, "students", studentId);
  
      const studentDocSnapshot = await getDoc(studentDocRef);
  
      if (studentDocSnapshot.exists()) {
        console.log("Roll number found:", studentDocSnapshot.data().rollNo);
        return studentDocSnapshot.data().rollNo;
      } else {
        console.log("Student document not found");
        return "N/A";
      }
    } catch (error) {
      console.error("Error fetching roll number:", error);
      return "N/A";
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, [branchName]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleFilter = (text) => {
    setFilterText(text);
  };

  const handleCellClick = (projectId) => {
    navigate(`${projectId}`);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const filteredProjects = sortedProjects.filter((project) => {
    return Object.values(project).some((value) =>
      value !== undefined && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });
  
  const columns = [
    { key: "projectName", label: "Project Name" },
    { key: "description", label: "Description" },
    { key: "domain", label: "Domain" },
    { key: "github", label: "GitHub" },
    { key: "appLink", label: "App Link" },
    { key: "rollNo", label: "Roll No." },
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
        {/* <FilterListIcon /> */}
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={classes.tableHeadCell}
                >
                  <TableSortLabel
                    active={sortConfig.key === column.key}
                    direction={
                      sortConfig.key === column.key ? sortConfig.direction : "asc"
                    }
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
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
          ) : (
            // Check if the column key is "rollNo" and display it
            column.key === "rollNo" ? project[column.key] : project[column.key]
          )}
        </TableCell>
      ))}
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectTable;
