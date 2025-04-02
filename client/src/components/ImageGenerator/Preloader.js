import React, { useEffect, useState } from 'react';
import Wavify from 'react-wavify';
import './Preloader.css';

const Preloader = ({ onTransitionEnd }) => {
  const [zoomOut, setZoomOut] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const zoomOutTimer = setTimeout(() => setZoomOut(true), 1000);
    const slideUpTimer = setTimeout(() => setSlideUp(true), 2500);
    const transitionEndTimer = setTimeout(() => {
      setHidden(true);
      if (onTransitionEnd) onTransitionEnd();
    }, 3000);

    return () => {
      clearTimeout(zoomOutTimer);
      clearTimeout(slideUpTimer);
      clearTimeout(transitionEndTimer);
    };
  }, [onTransitionEnd]);

  return (
    !hidden && (
      <div className={`preloader ${slideUp ? 'slide-up' : ''}`}>
        {/* Animated Wave Background */}
        

        <div className={`preloader-text ${zoomOut ? 'zoom-out' : ''}`}>
          <span className="art">Art</span>
          <span className="nova">Nova</span>
          <span className="tagline">Next-Gen AI-Powered Visual Creativity</span>
        </div>
      </div>
    )
  );
};

export default Preloader;
