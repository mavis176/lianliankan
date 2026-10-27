import React from 'react';
import { X, Star, Lock, Clock, Grid, Footprints, Flame, Sparkles } from 'lucide-react';
import { CAFE_LEVELS } from '../data/cafeData';
import { LevelProgress } from '../types/cafe';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  progressList: LevelProgress[];
  currentLevelId: number;
  endlessTier: number;
  onStartEndless: (tier: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  progressList,
  currentLevelId,
  endlessTier,
  onStartEndless,
}) => {
  if (!isOpen) return null;

  const progressMap = new Map(progressList.map(p => [p.levelId, p]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-[#FFFDF9] border border-amber-900/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/10 bg-amber-50/60 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-950 tracking-tight flex items-center gap-2">
              <span>关卡地图 · 食材采购</span>
              <span className="text-xs bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                1 ~ 30 关 + 无尽模式
              </span>
            </h2>
            <p className="text-[11px] text-amber-800/70 mt-0.5">
              限时竞速、步数规划与冰封木箱多种机制挑战
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endless Mode Banner */}
        <div className="px-5 pt-3 pb-1 shrink-0">
          <div className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 rounded-2xl p-3 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                <Flame className="w-5 h-5 text-yellow-200 animate-pulse" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>无尽挑战模式</span>
                  <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded-md font-mono">最高达成 Lv.{endlessTier}</span>
                </span>
                <span className="text-[10px] text-amber-100 mt-1">自动递增网格与冰封障碍，收获海量星光与金币</span>
              </div>
            </div>

            <button
              onClick={() => {
                onStartEndless(endlessTier || 1);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white text-[#8C4309] font-bold text-xs shadow-sm hover:bg-amber-50 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>进入挑战</span>
            </button>
          </div>
        </div>

        {/* Level Grid (30 levels) */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-gradient-to-br from-amber-100 to-orange-50 border-amber-400 shadow-md ring-2 ring-amber-400/40 cursor-pointer'
                    : 'bg-white hover:bg-amber-50/60 border-amber-200/80 hover:border-amber-300 shadow-xs cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-amber-700 font-mono">
                      LEVEL {level.id < 10 ? `0${level.id}` : level.id}
                    </span>
                    {!isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= stars
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                    {level.title.replace(/第 \d+ 关 · /, '')}
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{level.subtitle}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-900/5 flex items-center justify-between text-[10px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 font-mono">
                      <Grid className="w-2.5 h-2.5 text-amber-700/60" />
                      {level.rows}×{level.cols}
                    </span>
                    {level.mode === 'moves' ? (
                      <span className="flex items-center gap-0.5 font-mono text-amber-700 font-semibold bg-amber-50 px-1 rounded">
                        <Footprints className="w-2.5 h-2.5" />
                        {level.movesLimit}步
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5 text-amber-700/60" />
                        {level.timeLimit}s
                      </span>
                    )}
                    {level.frozenCount && level.frozenCount > 0 ? (
                      <span className="text-[9px]">🧊x{level.frozenCount}</span>
                    ) : null}
                    {level.obstacleType !== 'none' ? (
                      <span className="text-[9px]">📦</span>
                    ) : null}
                  </div>
                  {highScore > 0 && (
                    <span className="font-mono text-amber-700 font-semibold">
                      高分: {highScore}
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
