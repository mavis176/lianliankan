import React from 'react';
import { Lightbulb, RefreshCw, Clock } from 'lucide-react';

interface ActionToolsBarProps {
  hintsLeft: number;
  shufflesLeft: number;
  freezesLeft: number;
  isFrozen: boolean;
  onUseHint: () => void;
  onUseShuffle: () => void;
  onUseFreeze: () => void;
}

export const ActionToolsBar: React.FC<ActionToolsBarProps> = ({
  hintsLeft,
  shufflesLeft,
  freezesLeft,
  isFrozen,
  onUseHint,
  onUseShuffle,
  onUseFreeze,
}) => {
  return (
    <div className="w-full grid grid-cols-3 gap-2.5 shrink-0 select-none">
      {/* 1. 提示 (Hint) */}
      <button
        onClick={onUseHint}
        disabled={hintsLeft <= 0}
        className={`relative h-11 sm:h-12 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_3px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          hintsLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
          <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-600" />
        </div>
        <span className="text-xs sm:text-sm font-black text-[#5A381E]">提示</span>

        {/* Badge in bottom-right */}
        <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
          x{hintsLeft}
        </span>
      </button>

      {/* 2. 重排 (Shuffle) */}
      <button
        onClick={onUseShuffle}
        disabled={shufflesLeft <= 0}
        className={`relative h-11 sm:h-12 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_3px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          shufflesLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <RefreshCw className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs sm:text-sm font-black text-[#5A381E]">重排</span>

        {/* Badge */}
        <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
          x{shufflesLeft}
        </span>
      </button>

      {/* 3. 加时 (Freeze / +15s) */}
      <button
        onClick={onUseFreeze}
        disabled={freezesLeft <= 0 || isFrozen}
        className={`relative h-11 sm:h-12 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_3px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          freezesLeft <= 0 || isFrozen ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
          <Clock className={`w-3.5 h-3.5 ${isFrozen ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-xs sm:text-sm font-black text-[#5A381E]">
            {isFrozen ? '冰冻中' : '加时'}
          </span>
          <span className="text-[8px] text-sky-600 font-mono font-bold">+15s</span>
        </div>

        {/* Badge */}
        <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
          x{freezesLeft}
        </span>
      </button>
    </div>
  );
};
