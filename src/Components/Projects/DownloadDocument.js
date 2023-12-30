import React from 'react';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Download } from '@mui/icons-material';
import { IconButton } from '@material-ui/core';
import { styled } from "@mui/system";


const StyledIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const DownloadDocument = ({ projectData }) => {
  const handleDownload = () => {
    try {
      const downloadLink = projectData.documentation;

      // Open the download link in a new window
      window.open(downloadLink, '_blank');
    } catch (error) {
      console.error('Error triggering download:', error);
    }
  };

  return (
    <div>
      <StyledIconButton 
        
       
        onClick={handleDownload}>
 

   
      <Download/>

      </StyledIconButton>
     
    </div>
  );
};

export default DownloadDocument;
