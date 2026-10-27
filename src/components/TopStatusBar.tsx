import React from 'react';
import { Volume2, VolumeX, Settings, Pause } from 'lucide-react';

interface TopStatusBarProps {
  stars: number;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  stars,
  coins,
  soundEnabled,
  onToggleSound,
  onPause,
}) => {
  return (
    <div className="w-full px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
      {/* Left: Star & Coin Resource Pills */}
      <div className="flex items-center gap-2">
        {/* Star Pill */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-[#6B482A] px-2.5 py-0.5 rounded-full shadow-[0_2px_0_#6B482A]">
          <span className="text-base leading-none drop-shadow-sm">⭐</span>
          <span className="text-xs font-black text-[#5A381E] font-mono">
            x{stars}
          </span>
        </div>

        {/* Coin Pill */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-[#6B482A] px-2.5 py-0.5 rounded-full shadow-[0_2px_0_#6B482A]">
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-[#6B482A] flex items-center justify-center text-[10px] leading-none shadow-inner">
            🐾
          </div>
          <span className="text-xs font-black text-[#5A381E] font-mono">
            {coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Right: Pause & Sound Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPause}
          className="flex items-center gap-1 bg-[#FFFDF8] hover:bg-[#F6EFE6] border-2 border-[#6B482A] px-2.5 py-0.5 rounded-full shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs font-black text-[#5A381E]"
        >
          <span>暂停</span>
          <Settings className="w-3.5 h-3.5 text-[#6B482A]" />
        </button>

        <button
          onClick={onToggleSound}
          title={soundEnabled ? '音效开启' : '静音'}
          className="w-7 h-7 rounded-full bg-[#FFFDF8] hover:bg-[#F6EFE6] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#6B482A]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>
      </div>
    </div>
  );
};
