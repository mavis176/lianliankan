import React from 'react';
import { X, Star, Lock, Clock, Grid } from 'lucide-react';
import { CAFE_LEVELS } from '../data/cafeData';
import { LevelProgress } from '../types/cafe';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  progressList: LevelProgress[];
  currentLevelId: number;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  progressList,
  currentLevelId,
}) => {
  if (!isOpen) return null;

  const progressMap = new Map(progressList.map(p => [p.levelId, p]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#FFFDF9] border border-amber-900/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-900/10 bg-amber-50/60 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-amber-950 tracking-tight">关卡地图 · 咖啡物语</h2>
            <p className="text-xs text-amber-800/70 mt-0.5">挑战 18 个连连看关卡，赢取猫爪星与咖啡馆装修基金</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CAFE_LEVELS.map(level => {
            const prog = progressMap.get(level.id);
            const isUnlocked = prog ? prog.unlocked : level.id === 1;
            const stars = prog ? prog.stars : 0;
            const highScore = prog ? prog.highScore : 0;
            const isCurrent = currentLevelId === level.id;

            return (
              <button
                key={level.id}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(level.id);
                  onClose();
                }}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-gradient-to-br from-amber-100 to-orange-50 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white hover:bg-amber-50/60 border-amber-200/80 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-700 font-mono">
                      LEVEL {level.id < 10 ? `0${level.id}` : level.id}
                    </span>
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-stone-400" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                    {level.title.replace(/第 \d+ 关 · /, '')}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{level.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-900/5 flex items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Grid className="w-3 h-3 text-amber-700/60" />
                      {level.rows}×{level.cols}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-700/60" />
                      {level.timeLimit}s
                    </span>
                  </div>
                  {highScore > 0 && (
                    <span className="font-mono text-amber-700 font-semibold">
                      最高: {highScore}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
