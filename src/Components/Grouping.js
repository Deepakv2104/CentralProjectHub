import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TextField,
  TableBody,
  TableCell,
  TableRow,
  Paper,

  Button,
  IconButton,

  Select,
  MenuItem,
  TableContainer,

} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Search from "@mui/icons-material/Search";
import { arrayUnion } from 'firebase/firestore';

import { makeStyles } from "@mui/styles";
import Loop from "@mui/icons-material/Loop";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
addDoc
} from "firebase/firestore";
import { InputLabel } from "@material-ui/core";
import CsvUploadToFirebase from "./csvUpload";
import JsonUploadToFirebase from "./csvUpload";
const useStyles = makeStyles({
  tableContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "15px",
    marginRight: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowX: "auto",
    maxWidth: "1220px",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
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

// const highlightText = (text, search) => {
//   if (!text || !search) {
//     return text;
//   }

//   const searchRegex = new RegExp(`(${search})`, 'gi');
//   return text.replace(searchRegex, (match) => `<mark>${match}</mark>`);
// };


const GroupingComponent = () => {
  const [groups, setGroups] = useState([]);
  const [guideNames, setGuideNames] = useState(Array(groups.length).fill(""));
  const classes = useStyles();
  const [filterText, setFilterText] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [branch, setBranch] = useState("");
  const [facultyData, setFacultyData] = useState();
  const [sections, setSections] = useState([]);
  const [branches, setBranches] = useState([]);
  const [facultyNames, setFacultyNames] = useState([]);
  const [guideIds, setGuideIds] = useState(Array(groups.length).fill(""));
  const [projectType, setProjectType] = useState("");

  const [selectedDomain, setSelectedDomain] = useState(
    Array(groups.length).fill("")
  );


  const fetchFacultyDetails = async () => {
    if (branch) {
      const db = getFirestore();
      const facultyCollectionRef = collection(db, "Faculties");
    
      // Create a query to get faculty with the selected branch
      const facultyQuery = query(facultyCollectionRef, where("branch", "==", branch));
    
      try {
        const facultySnapshot = await getDocs(facultyQuery);
        const facultyDetails = [];
    
        facultySnapshot.forEach((doc) => {
          const facultyData = doc.data();
          facultyData.groupId = generateUniqueId();
          facultyDetails.push(facultyData);
        });
    
        console.log("Fetched Faculty Details:", facultyDetails);
    
        // Update state with the fetched details or perform any other necessary actions
        setFacultyData(facultyDetails);
        // Update state with the fetched details or perform any other necessary actions
setGuideNames(Array(facultyDetails.length).fill(""));
      } catch (error) {
        console.error("Error fetching faculty details:", error);
      }
    }
  };
  
  const generateUniqueId = () => {
    // Implement your logic to generate a unique ID here
    // Example using a simple timestamp-based approach
    return Date.now().toString();
  };
  


  useEffect(() => {
    // Fetch branch names from Firebase
    const fetchBranches = async () => {
      const db = getFirestore();
      const branchesCollectionRef = collection(db, "btech");

      try {
        const branchesSnapshot = await getDocs(branchesCollectionRef);
        const branchesArray = [];

        branchesSnapshot.forEach((doc) => {
          branchesArray.push(doc.id);
        });

        setBranches(branchesArray);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    // Fetch branch names
    fetchBranches();
  }, []);
// ...

useEffect(() => {
  // Fetch sections for the selected branch from Firebase
  const fetchSections = async () => {
    const db = getFirestore();
    const branchDocRef = doc(db, "btech", branch, "year", "IV");

    try {
      const branchDocSnapshot = await getDoc(branchDocRef);
      const branchData = branchDocSnapshot.data();
      const sectionsArray = branchData?.sections || [];

      console.log("Fetched Sections:", sectionsArray);

      setSections(sectionsArray);

      // Fetch faculty details after setting sections
      fetchFacultyDetails();
    } catch (error) {
      console.error("Error fetching branch details:", error);
    }
  };

  // Fetch sections for the selected branch
  if (branch) {
    fetchSections();
  }
}, [branch]);



 // Only run this effect when facultyData changes
useEffect(() => {
  // Set faculty names from the fetched facultyData
  const facultyNamesArray = facultyData ? facultyData.map((faculty) => faculty.fullName) : [];
  console.log("facultyNameArray", facultyNamesArray)
  setFacultyNames(facultyNamesArray);
}, [facultyData]);



  useEffect(() => {
    // Fetch student details for the selected branch and section from Firebase
    const fetchStudentDetails = async () => {
      if (branch && filterSection) {
        const db = getFirestore();
        const studentsCollectionRef = collection(db, "students");
        const studentsQuery = query(
          studentsCollectionRef,
          where("branch", "==", branch),
          where("section", "==", filterSection)
        );
  
        try {
          const studentsSnapshot = await getDocs(studentsQuery);
          const studentsDetails = [];
  
          studentsSnapshot.forEach((doc) => {
            const studentData = doc.data();
            studentsDetails.push(studentData);
          });
  
          console.log("Fetched Students Details:", studentsDetails);
  
          // Update state with the fetched details
          
  
          // Arrange students into groups
          arrangeStudentsIntoGroups(studentsDetails);
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      }
    };
  
    // Fetch student details
    fetchStudentDetails();
  }, [branch, filterSection]);
  

  const handleNameChange = (groupIndex, studentIndex, newName) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const updatedStudent = { ...newGroups[groupIndex][studentIndex], name: newName };
      newGroups[groupIndex][studentIndex] = updatedStudent;
      return newGroups;
    });
  };
  
  const handleRollNoChange = (groupIndex, studentIndex, newRollNo) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const updatedStudent = { ...newGroups[groupIndex][studentIndex], rollNo: newRollNo };
      newGroups[groupIndex][studentIndex] = updatedStudent;
      return newGroups;
    });
  };
  
  
  const arrangeStudentsIntoGroups = (students) => {
    // Sort students based on CGPA in descending order
    const sortedStudents = students.sort((a, b) => b.cgpa - a.cgpa);

    // Initialize an array to store the groups
    const groups = [];

    // Number of students in each group
    const studentsPerGroup = 3;

    // Calculate the number of groups needed
    const numGroups = Math.ceil(sortedStudents.length / studentsPerGroup);

    // Create empty groups
    for (let i = 0; i < numGroups; i++) {
      groups.push([]);
    }

    // Assign students to groups based on CGPA
    sortedStudents.forEach((student, index) => {
      const groupIndex = index % numGroups;
      groups[groupIndex].push(student);
    });

    // Set the state with the newly formed groups and guideNames
    setGroups(groups);
    setGuideNames(Array(groups.length).fill(""));
    console.log(groups, "inside");
  };

  // const getAvailableGuideNames = () => {
  //   const selectedGuideNames = new Set(
  //     guideNames.filter((name) => name !== "")
  //   );
  //   return facultyNames.filter((name) => !selectedGuideNames.has(name));
  // };


  const handleGuideNameChange = (groupIndex, newGuideName) => {
    // Find the corresponding guideId for the selected guideName
    const selectedGuide = facultyData.find((faculty) => faculty.fullName === newGuideName);

    // Check if the selected name is valid
    if (selectedGuide) {
      setGuideNames((prevGuideNames) => {
        const newGuideNames = [...prevGuideNames];
        newGuideNames[groupIndex] = newGuideName;
        return newGuideNames;
      });

      setGuideIds((prevGuideIds) => {
        const newGuideIds = [...prevGuideIds];
        newGuideIds[groupIndex] = selectedGuide.userId;
        return newGuideIds;
      });
    } else {
      // Handle the case when an invalid name is selected (optional)
      console.error("Invalid guide name selected:", newGuideName);
    }
  };

  
  

  const downloadCSV = () => {
    // Create CSV content
    const csvContent =
      "Group,Name,RollNumber,CGPA,Domain,Guide\n" +
      groups
        .map((group, index) =>
          group
            .map((student) => {
              const name = student?.name || "";
              const rollNumber = student?.rollNo || "";
              const cgpa = student?.cgpa || "";
              const domain = selectedDomain[index] || "";
              const guide = guideNames[index] || "";
              return `${index + 1},${name},${rollNumber},${cgpa},${domain},${guide}`;
            })
            .join("\n")
        )
        .join("\n");
  
    // Create a data URI for the CSV content
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  
    // Create an anchor element for download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grouping_data.csv");
  
    // Append the link to the document and trigger the click event
    document.body.appendChild(link);
    link.click();
  
    // Remove the link from the document
    document.body.removeChild(link);
  };
  
  const handleResetFilters = () => {
    setGroups([]);
    setGuideNames([]);
    setFilterText("");
    setFilterYear("");
    setFilterSection("");
    setBranch("");
    setSelectedDomain([]);
    setProjectType("");
  };



  // const handleFilter = (text) => {
  //   setFilterText(text);
  
  //   if (text.trim() === "") {
  //     setSearchResults([]);
  //   } else {
  //     const filteredResults = studentsDetails
  //       ? studentsDetails.filter(
  //           (student) =>
  //             student.name.toLowerCase().includes(text.toLowerCase()) ||
  //             student.rollNumber.toLowerCase().includes(text.toLowerCase())
  //         )
  //       : [];
  //     setSearchResults(filteredResults);
  
  //     // Highlight the matching text in the main table

      
  //   }
  // };
  

  
  // const handleSearchClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClosePopover = () => {
  //   setAnchorEl(null);
  // };

  const handleYearFilter = (event) => {
    setFilterYear(event.target.value);
  };

  const handleSectionFilter = (event) => {
    setFilterSection(event.target.value);
  };
  const handleBranchFilter = (event) => {
    setBranch(event.target.value);
  };

  const handleDomainChange = (index, event) => {
    const newDomain = event.target.value;
    setSelectedDomain((prevSelectedDomain) => {
      const newSelectedDomain = [...prevSelectedDomain];
      newSelectedDomain[index] = newDomain;
      return newSelectedDomain;
    });
  };
  const handleUpload = async () => {
    try {
      // Ensure there is data to upload
      if (groups.length === 0 || !branch || !filterYear || !filterSection) {
        console.error("Invalid data or missing filters for upload.");
        return;
      }
  
      // Create a reference to the Firebase Firestore database
      const db = getFirestore();
  
      // Iterate through each group and update the student documents
      groups.forEach(async (group, index) => {
        // Check if group is an array before iterating through it
        if (!Array.isArray(group)) {
          console.error(`Invalid group data at index ${index}. Skipping.`);
          return;
        }
        console.log("Adding document to 'groups' collection with data:", {
          groupName: `Group ${index + 1}`,
          students: group.map((student) => student.userId),
          guideId: guideIds[index] || "",
          domain: selectedDomain[index] || "",
          branch: branch,
          year: filterYear,
          section: filterSection,
          projectType: projectType,
        });
        
        const groupDocRef = await addDoc(collection(db, "groups"), {
          groupName: `Group ${index + 1}`,
          students: group.map((student) => student.userId),
          guideId: guideIds[index] || "",
          domain: selectedDomain[index] || "",
          branch: branch,
          year: filterYear,
          section: filterSection,
          projectType: projectType,
        });
        
        // Attach the groupId to the group document
        await updateDoc(groupDocRef, {
          groupId: groupDocRef.id,
        });
  
        // Update each student document with the groupId
        group.forEach(async (student) => {
          const studentDocRef = doc(db, "students", student.userId);
          await updateDoc(studentDocRef, {
            groupNumber: index + 1,
            domain: selectedDomain[index] || "",
            guideId: guideIds[index] || "",
            groupId: groupDocRef.id,
          });
        });
  
        // Update faculty data with the groupId
        const facultyDocRef = doc(db, "Faculties", guideIds[index]);
        await updateDoc(facultyDocRef, {
          groupIds: arrayUnion(groupDocRef.id),
        });
      });
      toast.success("Data uploaded successfully!");
      console.log("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error("Error uploading data. Please try again.");   
    }
  };
  
  
  
  
  
  return (
    <div>
      <div className={classes.filterContainer}>
      <TextField
          className={classes.filterInput}
          label="Search"
          variant="outlined"
          size="small"
          value={filterText}
          // onChange={(e) => handleFilter(e.target.value)}
        />
        <IconButton
          color="primary"
          // onClick={handleSearchClick}
          style={{ marginLeft: "15px" }}
        >
          <Search />
        </IconButton>
  <Select
    className={classes.filterInput}
    label="Filter by Department"
    variant="outlined"
    size="small"
    value={branch}
    onChange={handleBranchFilter}
    displayEmpty
  >
    <MenuItem disabled value="">
      Select Branch
    </MenuItem>
    {/* Fetch branch names dynamically from Firebase */}
    {branches.map((branchName) => (
      <MenuItem key={branchName} value={branchName}>
        {branchName}
      </MenuItem>
    ))}
  </Select>
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
    {/* Ensure sections is an array before mapping */}
    {Array.isArray(sections) &&
      sections.map((section) => (
        <MenuItem key={section} value={section}>
          {section}
        </MenuItem>
      ))}
  </Select>
  <Select
  className={classes.filterInput}
  label="Filter by Project Type"
  variant="outlined"
  size="small"
  value={projectType}
  onChange={(event) => setProjectType(event.target.value)}
  displayEmpty
>
  <MenuItem disabled value="">
    Select Project Type
  </MenuItem>
  <MenuItem value="Minor">Minor</MenuItem>
  <MenuItem value="Major">Major</MenuItem>
</Select>

  <IconButton
    color="primary"
    onClick={handleResetFilters}
    style={{ marginLeft: "15px" }}
  >
    <Loop />
  </IconButton>
  <div style={{ flex: 1 }} /> {/* Add a flexible space to push the button to the right */}
 
  <Button
    variant="contained"
    color="success" 
    onClick={downloadCSV}
    style={{ marginLeft: "15px" }}
  >
    Download CSV
  </Button>

</div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
                Group
              </TableCell>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
                Name
              </TableCell>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
              Roll Number
              </TableCell>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
                CGPA
              </TableCell>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
                Domain
              </TableCell>
              <TableCell style={{ backgroundColor: "#273656", color: "white" }}>
                GUIDE
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {groups.map((group, index) => (
  <TableRow key={index}>
    <TableCell>{index + 1}</TableCell>
    <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
      {group.map((student, studentIndex) => (
        <React.Fragment key={student.Inputd}>
          <TextField
            key={`${index}-${studentIndex}`}  // Add a unique key here
            value={student.name}
            onChange={(e) => handleNameChange(index, studentIndex, e.target.value)}
          />
          {studentIndex < group.length - 1 && <br />}
        </React.Fragment>
      ))}
      </TableCell>
      <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
        {group.map((student, studentIndex) => (
          <React.Fragment key={student.Id}>
            <TextField
              value={student.rollNo}
              onChange={(e) => handleRollNoChange(index, studentIndex, e.target.value)}
            />
            {studentIndex < group.length - 1 && <br />}
          </React.Fragment>
        ))}
      </TableCell>
      <TableCell style={{ border: "1px solid #ddd", padding: "8px" }}>
        {group.map((student, studentIndex) => (
          <React.Fragment key={student.Id}>
            <TextField
              value={student.cgpa}
             
            />
            {studentIndex < group.length - 1 && <br />}
          </React.Fragment>
        ))}
      </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "pre-line",
                  }}
                >
                  <Select
                   value={selectedDomain[index] || ""}
                   onChange={(event) => handleDomainChange(index, event)}
                   style={{ width: "100%" }}
                 
                  >
                    <MenuItem value="" disabled>
                      <em>Select an Option</em>
                    </MenuItem>
                    <MenuItem value="ML">ML</MenuItem>
                    <MenuItem value="Deep Learning">Deep Learning</MenuItem>
                    <MenuItem value="IoT">IoT</MenuItem>
                    <MenuItem value="Web Development">Web Development</MenuItem>
                  </Select>
                </TableCell>
                {/* Additional check to avoid adding multiple 'GUIDE' cells */}
                {group.length > 0 && (
  <TableCell>
    <InputLabel id={`guide-label-${index}`} shrink={false}>
      Guide
    </InputLabel>
    <Select
      labelId={`guide-label-${index}`}
      value={guideNames[index] || ""}
      onChange={(e) => handleGuideNameChange(index, e.target.value)}
      style={{ width: "250px" }}
      displayEmpty
    >
      <MenuItem value="" disabled>
        <em>Select Guide</em>
      </MenuItem>
      {facultyNames.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
)}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained"    color="success"  onClick={downloadCSV}>
          Download CSV
        </Button>
        <Button
        variant="contained"
        color="success"
        onClick={handleUpload}
        style={{ marginLeft: "15px" }}
      >
        Upload
      </Button>
      {/* <JsonUploadToFirebase/> */}
      </div>
    </div>
  );
};

export default GroupingComponent;
