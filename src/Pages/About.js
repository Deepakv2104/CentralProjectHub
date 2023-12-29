import React from 'react';
import Navbar from '../Components/Submenu/Navbar';
import '../Styles/About.css'

const About = () => {
  // Add a class to the body or a container wrapping your entire application
  // and apply styles to make it non-scrollable
  document.body.classList.add('no-scroll');

  return (
    <div className='about'> 
    <Navbar/>
 

      
    </div>
  );
}

export default About;
