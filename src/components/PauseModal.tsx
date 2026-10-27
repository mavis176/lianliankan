import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { CafeLevelConfig } from '../types/cafe';

interface PauseModalProps {
  isOpen: boolean;
  level: CafeLevelConfig;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  onResume: () => void;
  onReplay: () => void;
  onGoToCafe: () => void;
  onToggleSound: () => void;
  onToggleBgm: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  level,
  soundEnabled,
  bgmEnabled,
  onResume,
  onReplay,
  onGoToCafe,
  onToggleSound,
  onToggleBgm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border border-amber-900/15 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center text-slate-800">
        <h2 className="text-xl font-bold text-amber-950 tracking-tight">游戏已暂停</h2>
        <p className="text-xs text-amber-800/70 mt-0.5">{level.title}</p>

        {/* Audio toggles row */}
        <div className="flex items-center justify-center gap-3 my-5">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              soundEnabled
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span>音效: {soundEnabled ? '开启' : '静音'}</span>
          </button>

          <button
            onClick={onToggleBgm}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              bgmEnabled
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            <Music className={`w-4 h-4 ${bgmEnabled ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>音乐: {bgmEnabled ? '开启' : '静音'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>继续游戏</span>
          </button>

          <button
            onClick={onReplay}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新开始当前关</span>
          </button>

          <button
            onClick={onGoToCafe}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>返回咖啡馆大厅</span>
          </button>
        </div>
      </div>
    </div>
  );
};
