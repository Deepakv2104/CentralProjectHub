// ProfileCard.js
import React from 'react';
import '../Styles/ProfileCard.css'
import { Typography } from '@mui/material';

const ProfileCard = ({ name, imageUrl, backgroundColor, quote,rollNo }) => {
  return (
    <div className="profile-card" style={{cursor:'pointer'}}>
      <div className="avatar mx-auto bg-white">
        <img src={imageUrl} className="rounded-circle img-fluid" alt={name} />
      </div>
      <div className="card-body">
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

export default ProfileCard;
