import React from 'react';

interface ColoredDividerProps {
  topColor?: string;
  bottomColor?: string;
}

export default function ColoredDivider({ 
  topColor = "#FFF8FD", 
  bottomColor = "#F3E8FF" 
}: ColoredDividerProps) {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Séparateur avec dégradé et motif */}
      <div 
        className="w-full h-16 relative"
        style={{ background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})` }}
      >
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#A90BD9" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        {/* Ligne ondulée au milieu */}
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
          <svg 
            className="w-full h-8" 
            viewBox="0 0 1200 50" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0,25 C150,50 300,0 450,25 C600,50 750,0 900,25 C1050,50 1200,0 1200,25 L1200,25 L0,25 Z" 
              fill="none"
              stroke="#D90BB5"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#A90BD9]/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#A90BD9]/40"></div>
          </div>
        </div>
        
        <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#D90BB5]/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#D90BB5]/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
