// ProfileCarousel.js
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import profiles from '../Data/ProfileData';
import '../Styles/ProfileCarousel.css';
import TopContributorsCard from './TopContributors';

const ProfileCarousel = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const cardWidth = 200; // Set the card width here

  useEffect(() => {
    if (carouselRef.current) {
      const containerWidth = profiles.length * cardWidth;
      carouselRef.current.style.width = `${containerWidth}px`;
      carouselRef.current.style.height = '100%'; 
    }
  }, [cardWidth]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollDistance = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollLeft += scrollDistance;
    }
  };

  const handleCardClick = (item) => {
    navigate(`/student-dashboard/explore/top-contributors/${item.name.toLowerCase()}`);
  };

  return (
    <div className="profile-carousel-container">
   <div className="carousel-title">
        <h2 className="title-text1">Top Contributors</h2>
        <div className="title-line"></div>
      </div>
      <div className='nav-buttons-container'>
      <button className="nav-button left" onClick={() => scroll('left')}>
        &lt;
      </button>
     
      
      <div className="card-carousel" ref={carouselRef}>
        {profiles.map((item, index) => (
          <div key={index} className="card1" >
            <TopContributorsCard
              name={item.name}
              imageUrl={item.imageUrl}
              backgroundColor={item.backgroundColor}
              quote={item.quote}
              rollNo={item.rolNo}
            />
          </div>
        ))}
      </div>
      <button className="nav-button right" onClick={() => scroll('right')}>
        &gt;
      </button>
      </div>
    </div>
  );
};

export default ProfileCarousel;
