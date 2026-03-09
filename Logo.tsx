
import React, { createContext, useContext, useState } from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Shivuk AI Vector Logo
 * Updated to Gold and Orange aesthetic.
 */
export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`${className} transition-transform duration-300 hover:scale-110`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient Gold to Orange */}
        <linearGradient id="shivuk_gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1B701" /> {/* Gold */}
          <stop offset="100%" stopColor="#F8851A" /> {/* Orange */}
        </linearGradient>
        
        <filter id="gold_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#gold_glow)">
        <path 
          d="M12,2C8.13,2 5,5.13 5,9c0,2.38 1.19,4.47 3,5.74V17c0,0.55 0.45,1 1,1h6c0.55,0 1,-0.45 1,-1v-2.26 c1.81,-1.27 3,-3.36 3,-5.74C19,5.13 15.87,2 12,2z M9,20h6v2H9V20z M12,13c-1.1,0 -2,-0.9 -2,-2c0,-0.55 -0.45,-1 -1,-1 s-1,0.45 -1,1c0,2.21 1.79,4 4,4c0.55,0 1,-0.45 1,-1S12.55,13 12,13z" 
          fill="url(#shivuk_gold)"
        />
      </g>
    </svg>
  );
};
    