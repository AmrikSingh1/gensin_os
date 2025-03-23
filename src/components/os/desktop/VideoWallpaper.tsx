'use client'

import React, { useEffect, useRef } from 'react'

interface VideoWallpaperProps {
  src: string;
  opacity?: number;
}

const VideoWallpaper: React.FC<VideoWallpaperProps> = ({ 
  src, 
  opacity = 0.8 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Set up video to autoplay and loop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [src]);
  
  console.log('Video wallpaper rendered with src:', src); // Debugging
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 min-w-full min-h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoWallpaper; 