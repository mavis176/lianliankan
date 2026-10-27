import React from 'react';

interface CatClockProps {
  timeLeft: number; // in seconds
  isFrozen?: boolean;
}

export const CatClock: React.FC<CatClockProps> = ({ timeLeft, isFrozen }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeft <= 20 && !isFrozen;

  return (
    <div className={`relative flex flex-col items-center justify-center shrink-0 ${isUrgent ? 'animate-bounce' : ''}`}>
      {/* Cat Clock Outer Shell with Ears */}
      <div className="relative w-[78px] h-[78px] flex items-center justify-center">
        {/* SVG Cat Clock Shell with Ears */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Left Cat Ear */}
          <path
            d="M20 34L10 12C16 12 28 18 32 26Z"
            fill="#F6E7D2"
            stroke="#6B482A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M19 28L14 16C18 16 25 20 27 24Z" fill="#F8B4B4" />

          {/* Right Cat Ear */}
          <path
            d="M80 34L90 12C84 12 72 18 68 26Z"
            fill="#F6E7D2"
            stroke="#6B482A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M81 28L86 16C82 16 75 20 73 24Z" fill="#F8B4B4" />

          {/* Clock Round Face */}
          <circle
            cx="50"
            cy="56"
            r="38"
            fill="#FAF6EE"
            stroke="#6B482A"
            strokeWidth="4"
          />
          {/* Inner ring */}
          <circle
            cx="50"
            cy="56"
            r="34"
            fill="none"
            stroke="#EBD8C1"
            strokeWidth="1.5"
          />
        </svg>

        {/* Clock Face Content Overlay */}
        <div className="absolute inset-0 pt-3 flex flex-col items-center justify-center pointer-events-none">
          {/* Red Play / Pause indicator icon */}
          <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-rose-500 mb-0.5 ml-0.5" />

          {/* Time digits */}
          <span className={`font-mono text-xs font-black tracking-tighter ${isFrozen ? 'text-cyan-600 animate-pulse' : isUrgent ? 'text-rose-600' : 'text-[#5A381E]'}`}>
            {timeStr}
          </span>
        </div>
      </div>
    </div>
  );
};
