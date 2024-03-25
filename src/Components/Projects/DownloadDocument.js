import React from 'react';

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
   
      <StyledIconButton 
        
       
        onClick={handleDownload}>
 

   
      <Download/>

      </StyledIconButton>
     
    
  );
};

export default DownloadDocument;
