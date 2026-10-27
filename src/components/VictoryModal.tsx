import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Hammer, Coins } from 'lucide-react';
import { CafeLevelConfig } from '../types/cafe';

interface VictoryModalProps {
  isOpen: boolean;
  level: CafeLevelConfig;
  score: number;
  baseScore: number;
  timeBonus: number;
  comboBonus: number;
  starsEarned: number;
  coinsEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onGoToCafe: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  level,
  score,
  baseScore,
  timeBonus,
  comboBonus,
  starsEarned,
  coinsEarned,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onGoToCafe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-250">
      <div className="relative w-full max-w-md bg-[#FFFDF9] border border-amber-900/15 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center text-slate-800">
        {/* Glow Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-400/30 mb-3 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-amber-950 tracking-tight">食材采购成功！🐾</h2>
        <p className="text-xs text-amber-800/70 mt-0.5">{level.title} · 新鲜食材已送达咖啡馆</p>

        {/* 3 Stars Animation */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map(s => {
            const earned = s <= starsEarned;
            return (
              <div
                key={s}
                className={`transition-all duration-500 transform ${
                  earned ? 'scale-110 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 'scale-90 opacity-25'
                }`}
              >
                <Star
                  className={`w-9 h-9 ${
                    earned ? 'fill-amber-400 text-amber-400' : 'text-stone-400'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Reward Pill Banner */}
        <div className="w-full bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-3 border border-amber-300/80 mb-4 flex items-center justify-around">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 text-sm">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>星光灵感: +{starsEarned}</span>
          </div>
          <div className="w-px h-5 bg-amber-300" />
          <div className="flex items-center gap-1.5 font-bold text-amber-800 text-sm">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>营业金币: +{coinsEarned}</span>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="w-full bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 mb-5 flex flex-col gap-2 text-xs text-stone-600">
          <div className="flex items-center justify-between">
            <span>基础食材消除得分</span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">{baseScore.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>剩余时间加成 (+10/秒)</span>
            <span className="font-mono tabular-nums font-semibold text-emerald-600">+{timeBonus.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>最高连击奖励</span>
            <span className="font-mono tabular-nums font-semibold text-rose-500">+{comboBonus.toLocaleString()}</span>
          </div>
          <div className="h-px bg-amber-200/80 my-0.5" />
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-amber-900">总计得分</span>
            <span className="font-mono tabular-nums text-lg text-amber-600">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onGoToCafe}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-transform active:scale-98 cursor-pointer"
          >
            <span>返回咖啡馆装扮 📖</span>
          </button>

          <div className="flex items-center gap-2 w-full">
            {hasNextLevel && (
              <button
                onClick={onNextLevel}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-colors cursor-pointer"
              >
                <span>继续采购下一关</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>再玩一次</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
