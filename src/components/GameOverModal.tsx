import React from 'react';
import { Hourglass, RotateCcw, Home } from 'lucide-react';
import { CafeLevelConfig } from '../types/cafe';

interface GameOverModalProps {
  isOpen: boolean;
  level: CafeLevelConfig;
  score: number;
  remainingPairs: number;
  onReplay: () => void;
  onGoToCafe: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  level,
  score,
  remainingPairs,
  onReplay,
  onGoToCafe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-250">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border border-amber-900/15 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center text-slate-800">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-400 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 mb-3">
          <Hourglass className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-xl font-bold text-amber-950 tracking-tight">倒计时结束！</h2>
        <p className="text-xs text-amber-800/70 mt-0.5">{level.title} · 差一点就通关啦</p>

        {/* Status card */}
        <div className="w-full bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 my-4 flex flex-col gap-2 text-xs text-stone-600">
          <div className="flex items-center justify-between">
            <span>当前得分</span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">{score.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>剩余未消除</span>
            <span className="font-mono tabular-nums font-bold text-rose-500">{remainingPairs} 对</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onReplay}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-transform active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再次挑战本关</span>
          </button>

          <button
            onClick={onGoToCafe}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>返回咖啡馆休息</span>
          </button>
        </div>
      </div>
    </div>
  );
};
