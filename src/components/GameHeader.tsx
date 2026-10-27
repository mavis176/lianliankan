import React from 'react';
import { Volume2, VolumeX, Music, Home, Pause, Hammer, Play, FileCode, Star, Coins } from 'lucide-react';
import { CafeLevelConfig } from '../types/cafe';

interface GameHeaderProps {
  currentView: 'CAFE' | 'PUZZLE';
  currentLevel: CafeLevelConfig;
  score: number;
  timeLeft: number;
  isFrozen: boolean;
  combo: number;
  stars: number;
  coins: number;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  onPause: () => void;
  onSwitchToCafe: () => void;
  onSwitchToPuzzle: () => void;
  onOpenRenovation: () => void;
  onOpenExport: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentView,
  currentLevel,
  score,
  timeLeft,
  isFrozen,
  combo,
  stars,
  coins,
  soundEnabled,
  bgmEnabled,
  onToggleSound,
  onToggleBgm,
  onPause,
  onSwitchToCafe,
  onSwitchToPuzzle,
  onOpenRenovation,
  onOpenExport,
}) => {
  return (
    <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-900/10 px-4 md:px-8 py-3 flex items-center justify-between gap-4 shrink-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
          ☕
        </div>
        <div>
          <span className="text-base font-bold text-amber-950 tracking-tight block leading-tight">
            暖喵咖啡馆
          </span>
          <span className="text-[10px] text-amber-800/60 font-medium tracking-wider block">
            PURR & COFFEE MATCH
          </span>
        </div>
      </div>

      {/* Zone 2: Unboxed Metrics */}
      {currentView === 'PUZZLE' ? (
        <div className="hidden lg:flex items-center gap-3 text-sm text-stone-600 font-medium">
          <span className="text-amber-950 font-bold">{currentLevel.title}</span>
          <span aria-hidden="true" className="text-amber-300">·</span>
          <div className="flex items-center gap-1">
            <span className="text-stone-400">时间:</span>
            <span className={`font-mono tabular-nums font-bold ${isFrozen ? 'text-cyan-500 animate-pulse' : timeLeft <= 15 ? 'text-rose-500 animate-pulse' : 'text-amber-600'}`}>
              {timeLeft}s {isFrozen && '❄️'}
            </span>
          </div>
          <span aria-hidden="true" className="text-amber-300">·</span>
          <div className="flex items-center gap-1">
            <span className="text-stone-400">得分:</span>
            <span className="font-mono tabular-nums font-bold text-amber-700">
              {score.toLocaleString()}
            </span>
          </div>
          {combo > 1 && (
            <>
              <span aria-hidden="true" className="text-amber-300">·</span>
              <span className="font-mono tabular-nums font-bold text-pink-500 animate-bounce">
                连击 x{combo}
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 bg-amber-100/70 border border-amber-200 px-3 py-1.5 rounded-full text-amber-800">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>猫爪星: {stars}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-100/70 border border-amber-200 px-3 py-1.5 rounded-full text-amber-800">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>金币: {coins}</span>
          </div>
        </div>
      )}

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {currentView === 'PUZZLE' ? (
          <>
            <button
              onClick={onSwitchToCafe}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>回咖啡馆</span>
            </button>
            <button
              onClick={onPause}
              title="暂停游戏"
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onOpenRenovation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors shadow-sm"
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>装潢计划</span>
            </button>
            <button
              onClick={onSwitchToPuzzle}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-amber-500/25 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>开始消除</span>
            </button>
          </>
        )}

        <button
          onClick={onToggleSound}
          title={soundEnabled ? '音效开启' : '音效静音'}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
        </button>

        <button
          onClick={onToggleBgm}
          title={bgmEnabled ? '背景音乐开启' : '背景音乐关闭'}
          className={`p-2 rounded-xl transition-colors ${bgmEnabled ? 'bg-amber-500/20 text-amber-600' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenExport}
          title="导出单文件 HTML 源码"
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <FileCode className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
