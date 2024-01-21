// ExploreProjects.js

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../Styles/Carousel.css';

const Carousel = ({ title, data, cardWidth, visibleCards }) => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const role = useParams();
  const location = useLocation();

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollDistance = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollLeft += scrollDistance;
    }
  };

  const handleCardClick = (item) => {
    const prefix = location.pathname.startsWith('/admin-dashboard') ? 'admin' : 'student';
    navigate(`/${prefix}-dashboard/explore/${item.name}`);
  };

  return (
    <div className="card-carousel-container">
      <div className="carousel-title">
        <h2 className="title-text">{title}</h2>
        <div className="title-line"></div>
      </div>
      <div className="nav-buttons-container">
        <button className="nav-button left" onClick={() => scroll('left')}>
          &lt;
        </button>
        <div className="card-carousel" ref={carouselRef}>
          {data.map((item, index) => (
            <div key={index} className="card" onClick={() => handleCardClick(item)}>
              <img src={item.image} alt={item.name} className="branch-image" />
              <div className="card-content">
                <p>{item.name}</p>
              </div>
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

Carousel.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  cardWidth: PropTypes.number.isRequired,
  visibleCards: PropTypes.number.isRequired,
};

Carousel.defaultProps = {
  cardWidth: 200,
  visibleCards: 4,
};

export default Carousel;
