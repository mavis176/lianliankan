import React from 'react';

interface BottomNavBarProps {
  progressPercent: number; // 0 to 100
  onBackToLobby: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  progressPercent,
  onBackToLobby,
}) => {
  return (
    <div className="w-full pt-1 pb-2 flex items-center justify-between gap-3 shrink-0 select-none">
      {/* Left: 大厅 (返回) button */}
      <button
        onClick={onBackToLobby}
        className="h-11 px-4 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_3px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center justify-center leading-tight cursor-pointer shrink-0"
      >
        <span className="text-xs sm:text-sm font-black text-[#5A381E]">大厅</span>
        <span className="text-[9px] text-[#8C623E] font-medium leading-none">(返回)</span>
      </button>

      {/* Right: Green Level Clearance Progress Track */}
      <div className="flex-1 h-11 bg-[#FFFDF8] border-2 border-[#6B482A] rounded-2xl p-1.5 shadow-[0_3px_0_#6B482A] flex items-center">
        <div className="w-full h-full bg-[#E8DCBF] border border-[#6B482A] rounded-xl p-0.5 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#A5D67D] to-[#86C852] border border-[#5E9B2F] rounded-lg transition-all duration-300 relative shadow-sm"
            style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
          >
            {/* Glossy highlight stripe on the progress fill */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-lg pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
