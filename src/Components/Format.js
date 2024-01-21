import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const CSVTable = () => {
  const [csvData, setCSVData] = useState([]);

  useEffect(() => {
    // Your CSV data
    const data = [
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["TEAM .NO", "Name of the Student", "H.No", "Domain Name", "Existing GUIDEs", "Title of the project"],
      ["TEAM 1", "TADUKA SAI TEHITH", "20EG106240", "ML", "Dr Manoranjan Dash", ""],
      ["", "BOMMANA SATHWIK RAO", "20EG106207", "", "", ""],
      ["", "BHUWAN GOUD BADAGOUNI", "20EG106206", "", "", ""],
      ["TEAM 2", "N SHIVA MANI", "20EG106220", "ML", "Shilpa Shesham", "Symmetric key encryption with keyword search for cloud storage security"],
      ["", "KOLLU RISHI CHOWDARY", "20EG106217", "", "", ""],
      ["", "VURUKONDA ARUN", "20EG106253", "", "", ""],
   
    ];

    setCSVData(data);
  }, []);

  // Extract headers from the first non-empty row
  const staticHeaders = ["TEAM .NO", "Name of the Student", "H.No", "Domain Name", "Existing GUIDEs", "Title of the project"];
  const headers = csvData.find(row => row.some(cell => cell !== '')) || staticHeaders;

  return (
    <div>
      <h2>CSV Data</h2>
      <TableContainer component={Paper}>
        <Table border="1">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {csvData.slice(headers.length).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <TableCell key={columnIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Typography variant="body2">Number of Columns: {headers.length}</Typography>
        <Typography variant="body2">Number of Rows: {csvData.length - headers.length}</Typography>
      </div>
    </div>
  );
};

export default CSVTable;
