
import React from 'react';
import '../Styles/TopContributorsCard.css'
import { Typography } from '@mui/material';

const TopContributorsCard = ({ name, imageUrl, backgroundColor, quote,rollNo }) => {
  return (
    <div className="profile-card1" style={{cursor:'pointer'}}>
      <div className="avatar1 mx-auto bg-white">
        <img src={imageUrl} className="rounded-circle img-fluid" alt={name} />
      </div>
      <div className="card-body1">
        <h4 className="mb-4">{name}</h4>
        <hr />
      
         
        <Typography variant='subtitle2'>
        {quote}
        </Typography>
         
        <Typography className="dark-grey-text mt-4">
         
          {rollNo}
        </Typography>
      </div>
    </div>
  );
};

export default TopContributorsCard;
