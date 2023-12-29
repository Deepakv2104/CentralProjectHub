// ProfileCard.js
import React from 'react';
import '../Styles/ProfileCard.css'

const ProfileCard = ({ name, imageUrl, backgroundColor, quote,rollNo }) => {
  return (
    <div className="profile-card" >
      <div className="avatar mx-auto bg-white">
        <img src={imageUrl} className="rounded-circle img-fluid" alt={name} />
      </div>
      <div className="card-body">
        <h4 className="mb-4">{name}</h4>
        <hr />
        <h7 className="dark-grey-text mt-4">
          <i className="fas fa-quote-left pe-2"></i>
          {quote}
        </h7>
        <p className="dark-grey-text mt-4">
          <i className="fas fa-quote-left pe-2"></i>
          {rollNo}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
