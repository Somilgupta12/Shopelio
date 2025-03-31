import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative w-64 h-64">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        >
          <source src="/images/3513072467-preview.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="mt-8 text-gray-600 text-lg font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingAnimation; 