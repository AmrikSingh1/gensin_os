'use client'

import React from 'react'

interface SimpleVideoBackgroundProps {
  src: string;
  opacity?: number;
}

const SimpleVideoBackground: React.FC<SimpleVideoBackgroundProps> = ({ 
  src, 
  opacity = 0.8 
}) => {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <video
        className="absolute top-0 left-0 min-w-full min-h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity }}
        id="video-wallpaper"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default SimpleVideoBackground; 