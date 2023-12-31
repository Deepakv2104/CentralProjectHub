// CardComponent.js
import React from "react";
import "../Styles/Card.css";
import ExploreProjects from "./Carousel";
import branches from "../Data/Branches";
import computerScienceDomains from "../Data/TechDomains";
import Carousel from "./Carousel";
import ProfileCarousel from "./ProfileCarousel";

const Explore = () => {
  return (
    <div className="actual-card">
      <div className="c1">
        <Carousel
          title="Explore branches"
          data={branches}
          cardWidth={180} // Adjusted cardWidth for the branches carousel
          visibleCards={4}
        />
      </div>
      <div className="c1">
        <Carousel
          title="Explore Computer Science Projects"
          data={computerScienceDomains}
          cardWidth={180} // Adjusted cardWidth for the computer science projects carousel
          visibleCards={4}
        />
      </div>
      <div className="c1">
        <ProfileCarousel />
      </div>
    </div>
  );
};

export default Explore;
