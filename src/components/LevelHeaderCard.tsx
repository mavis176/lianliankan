import React from 'react';
import { CatClock } from './CatClock';

interface LevelHeaderCardProps {
  levelId: number;
  levelTitle: string;
  timeLeft: number;
  isFrozen: boolean;
  score: number;
  targetScores: [number, number, number];
  clearedPairs: number;
  totalPairs: number;
}

export const LevelHeaderCard: React.FC<LevelHeaderCardProps> = ({
  levelId,
  levelTitle,
  timeLeft,
  isFrozen,
  score,
  targetScores,
  clearedPairs,
  totalPairs,
}) => {
  const starsEarned = score >= targetScores[2] ? 3 : score >= targetScores[1] ? 2 : score >= targetScores[0] ? 1 : 0;
  const progressPercent = Math.min(100, (score / targetScores[2]) * 100);

  return (
    <div className="w-full bg-[#FFFDF8] border-2 border-[#6B482A] rounded-2xl p-2.5 shadow-[0_3px_0_#6B482A] flex items-center justify-between gap-3 shrink-0 select-none">
      {/* Left Column: Title & Goals */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Title */}
        <h2 className="text-sm sm:text-base font-black text-[#5A381E] truncate tracking-tight">
          关卡 {levelId} {levelTitle.replace(/第 \d+ 关 · /, '')} <span className="text-xs text-[#8C623E] font-normal">(Level {levelId})</span>
        </h2>

        {/* Brown Star Progress Meter */}
        <div className="w-full bg-[#8C603D] border border-[#6B482A] rounded-full h-3 my-1 p-0.5 relative flex items-center shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />

          {/* 3 Stars on the progress track */}
          <div className="absolute right-2 flex items-center gap-0.5">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`text-[10px] leading-none ${
                  s <= starsEarned
                    ? 'text-yellow-300 drop-shadow-[0_0_3px_rgba(253,224,71,0.8)]'
                    : 'text-[#5A381E]/60'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Target & Collection Count text */}
        <div className="flex items-center justify-between text-[11px] font-bold text-[#6B482A]">
          <span>目标：消除所有食材</span>
          <span className="font-mono">
            {clearedPairs}/{totalPairs}
          </span>
        </div>
      </div>

      {/* Right Column: Cat Eared Timer Clock */}
      <CatClock timeLeft={timeLeft} isFrozen={isFrozen} />
    </div>
  );
};
