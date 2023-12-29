import React from 'react';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

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
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudDownloadIcon />}
        onClick={handleDownload}
      >
        Download Document
      </Button>
    </div>
  );
};

export default DownloadDocument;
