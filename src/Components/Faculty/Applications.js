// ApplicationsList.js
import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Checkbox,
  IconButton,
  TableCell,
  TableBody,
  TableRow,
  Table,
  TextField,
  TableHead,
  Input
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    width: '100%',
    marginBottom: theme.spacing(2),
    maxHeight: '500px', // Set a max height for the left card
    overflowY: 'auto', // Add a vertical scrollbar when content exceeds the max height
  },
  paper: {
    padding: theme.spacing(2),
    height: '300px', // Set your desired fixed height here for the right card
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '8px',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    columnGap: '8px',
  },

  refreshIcon: {
    marginRight: theme.spacing(1),
  },
  nextPageIcon: {
    marginLeft: 'auto',
  },
}));

const mockData = [
  { id: 1, studentName: 'John Doe', requestType: 'Leave', status: 'Pending' },
  { id: 2, studentName: 'Jane Doe', requestType: 'Excursion', status: 'Approved' },
  { id: 3, studentName: 'Alice Smith', requestType: 'Conference', status: 'Pending' },
  { id: 4, studentName: 'Bob Johnson', requestType: 'Study Tour', status: 'Approved' },
  { id: 5, studentName: 'Eva White', requestType: 'Medical Leave', status: 'Pending' },
  { id: 6, studentName: 'Charlie Brown', requestType: 'Field Trip', status: 'Approved' },
  { id: 7, studentName: 'Grace Turner', requestType: 'Vacation', status: 'Pending' },
  { id: 8, studentName: 'David Miller', requestType: 'Project Presentation', status: 'Approved' },
  { id: 9, studentName: 'Sophia Davis', requestType: 'Training Program', status: 'Pending' },
  { id: 10, studentName: 'Michael Harris', requestType: 'Team Building', status: 'Approved' },
];

const ApplicationsList = () => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockData.filter((application) =>
    application.id.toString().includes(searchTerm)
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {/* Left Side: List of Requests */}
        <Grid item xs={10}>
          <div className={classes.toolbar}>
            <Typography variant="h4">Requests</Typography>
            <div>
              <Input
                label="Search by Request ID"
                placeholder="Enter Request ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Checkbox />
              <IconButton className={classes.refreshIcon} color="primary">
                <RefreshIcon />
              </IconButton>
              {/* Add other toolbar buttons/icons as needed */}
            </div>
          </div>
          <Card className={classes.card}>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Request Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.id}</TableCell>
                      <TableCell>{application.studentName}</TableCell>
                      <TableCell>{application.subject}</TableCell>
                      <TableCell>{application.requestType}</TableCell>
                      {/* Add more TableCell components for other data */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
         
        </Grid>

        {/* Right Side: Analysis */}
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Analysis
            </Typography>
            {/* Add analysis content here */}
            <Typography color="textSecondary">
              Total Requests: {mockData.length}
            </Typography>
            <Typography color="textSecondary">
              Pending Requests: {mockData.filter((app) => app.status === 'Pending').length}
            </Typography>
            {/* Add more analysis metrics as needed */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ApplicationsList;