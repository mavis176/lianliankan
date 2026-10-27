import React from 'react';
import { Lightbulb, Shuffle, Snowflake, Star } from 'lucide-react';

interface ControlBarProps {
  hintsLeft: number;
  shufflesLeft: number;
  freezesLeft: number;
  timeLeft: number;
  maxTime: number;
  isFrozen: boolean;
  score: number;
  combo: number;
  targetScores: [number, number, number];
  onUseHint: () => void;
  onUseShuffle: () => void;
  onUseFreeze: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  hintsLeft,
  shufflesLeft,
  freezesLeft,
  timeLeft,
  maxTime,
  isFrozen,
  score,
  combo,
  targetScores,
  onUseHint,
  onUseShuffle,
  onUseFreeze,
}) => {
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isUrgent = timeLeft <= 15 && !isFrozen;

  // Star calculation
  const starsEarned = score >= targetScores[2] ? 3 : score >= targetScores[1] ? 2 : score >= targetScores[0] ? 1 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col gap-1.5 shrink-0">
      {/* Mobile Stats Ribbon (shown only on <lg) */}
      <div className="flex lg:hidden items-center justify-between text-xs text-stone-600 bg-white/80 rounded-xl px-3 py-1.5 border border-amber-200/60 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400">时间:</span>
          <span className={`font-mono font-bold ${isFrozen ? 'text-cyan-500' : isUrgent ? 'text-rose-500' : 'text-amber-700'}`}>
            {timeLeft}s {isFrozen && '❄️'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400">得分:</span>
          <span className="font-mono font-bold text-amber-800">{score}</span>
        </div>
        {combo > 1 && (
          <div className="font-mono font-bold text-pink-500 animate-pulse">
            连击 x{combo}
          </div>
        )}
        <div className="flex items-center gap-0.5 text-amber-500">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${s <= starsEarned ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Time Progress Bar */}
      <div className="w-full bg-stone-200/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-amber-900/10">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isFrozen
              ? 'bg-gradient-to-r from-cyan-400 to-sky-500 animate-pulse'
              : isUrgent
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse'
              : 'bg-gradient-to-r from-amber-400 to-orange-400'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Power-up action buttons row */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        {/* Star rating status on Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500">
          <span>关卡评级:</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map(s => (
              <Star
                key={s}
                className={`w-4 h-4 transition-all ${
                  s <= starsEarned ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <span className="text-stone-400 font-mono text-[11px] ml-1">
            (下星需: {score < targetScores[0] ? targetScores[0] : score < targetScores[1] ? targetScores[1] : score < targetScores[2] ? targetScores[2] : '满星'})
          </span>
        </div>

        {/* Action Power-ups */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Hint */}
          <button
            onClick={onUseHint}
            disabled={hintsLeft <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              hintsLeft > 0
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm cursor-pointer'
                : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>提示</span>
            <span className="bg-amber-500/20 text-amber-900 text-[10px] px-1.5 rounded-full font-mono">
              {hintsLeft}
            </span>
          </button>

          {/* Shuffle */}
          <button
            onClick={onUseShuffle}
            disabled={shufflesLeft <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              shufflesLeft > 0
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm cursor-pointer'
                : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>洗牌</span>
            <span className="bg-amber-500/20 text-amber-900 text-[10px] px-1.5 rounded-full font-mono">
              {shufflesLeft}
            </span>
          </button>

          {/* Freeze */}
          <button
            onClick={onUseFreeze}
            disabled={freezesLeft <= 0 || isFrozen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              freezesLeft > 0 && !isFrozen
                ? 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border-cyan-300 shadow-sm cursor-pointer'
                : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Snowflake className={`w-3.5 h-3.5 ${isFrozen ? 'animate-spin' : ''}`} />
            <span>{isFrozen ? '冰冻中' : '冰冻 +10s'}</span>
            <span className="bg-cyan-500/20 text-cyan-900 text-[10px] px-1.5 rounded-full font-mono">
              {freezesLeft}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
