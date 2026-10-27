import React from 'react';
import { ArrowLeft, Pause, Volume2, VolumeX, Lightbulb, RefreshCw, Clock } from 'lucide-react';
import { CatClock } from './CatClock';
import { CafeLevel, Point } from '../types/cafe';
import { LianLianKanBoard } from './LianLianKanBoard';
import { ParticleCanvas, ParticleCanvasRef } from './ParticleCanvas';

interface PuzzleGameViewProps {
  level: CafeLevel;
  grid: number[][];
  selectedTile: Point | null;
  hintedPair: [Point, Point] | null;
  onTileClick: (r: number, c: number, rect: { x: number; y: number; width: number; height: number }) => void;
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  particleCanvasRef: React.RefObject<ParticleCanvasRef | null>;
  timeLeft: number;
  isFrozen: boolean;
  score: number;
  clearedPairs: number;
  totalPairs: number;
  progressPercent: number;
  hintsLeft: number;
  shufflesLeft: number;
  freezesLeft: number;
  onUseHint: () => void;
  onUseShuffle: () => void;
  onUseFreeze: () => void;
  onBackToCafe: () => void;
  onOpenPause: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  comboNotice: { id: number; text: string; count: number; bonus: number; x: number; y: number } | null;
}

export const PuzzleGameView: React.FC<PuzzleGameViewProps> = ({
  level,
  grid,
  selectedTile,
  hintedPair,
  onTileClick,
  boardContainerRef,
  particleCanvasRef,
  timeLeft,
  isFrozen,
  score,
  clearedPairs,
  totalPairs,
  progressPercent,
  hintsLeft,
  shufflesLeft,
  freezesLeft,
  onUseHint,
  onUseShuffle,
  onUseFreeze,
  onBackToCafe,
  onOpenPause,
  soundEnabled,
  onToggleSound,
  comboNotice,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FAF5EE] select-none font-sans p-2 sm:p-3">
      {/* 1. TOP DEDICATED PUZZLE HEADER */}
      <header className="w-full flex items-center justify-between gap-2 pb-2 shrink-0 z-20">
        {/* Left: Return to Cafe Button */}
        <button
          onClick={onBackToCafe}
          className="h-10 px-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          title="返回咖啡馆"
        >
          <ArrowLeft className="w-4 h-4 text-[#6B482A]" />
          <span className="text-xs sm:text-sm font-black text-[#5A381E]">返回咖啡馆</span>
        </button>

        {/* Center: Level & Target Badges */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-base font-black text-[#5A381E] truncate">
              第 {level.id} 关 · {level.title.replace(/第 \d+ 关 · /, '')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#8C623E]">
            <span>目标配对:</span>
            <span className="bg-[#8C603D] text-white px-2 py-0.2 rounded-full font-mono text-[10px] shadow-inner">
              {clearedPairs} / {totalPairs}
            </span>
          </div>
        </div>

        {/* Right: Clock & Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          <CatClock timeLeft={timeLeft} isFrozen={isFrozen} />

          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-full bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={soundEnabled ? '音效开启' : '静音'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#6B482A]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          <button
            onClick={onOpenPause}
            className="w-8 h-8 rounded-full bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="暂停"
          >
            <Pause className="w-3.5 h-3.5 text-[#6B482A]" />
          </button>
        </div>
      </header>

      {/* 2. POWER-UP ACTION BAR (提示, 重排, 加时) */}
      <div className="w-full grid grid-cols-3 gap-2 pb-2 shrink-0 z-20">
        {/* 提示 (Hint) */}
        <button
          onClick={onUseHint}
          disabled={hintsLeft <= 0}
          className={`relative h-11 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            hintsLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
            <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
          </div>
          <span className="text-xs sm:text-sm font-black text-[#5A381E]">提示</span>
          <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
            x{hintsLeft}
          </span>
        </button>

        {/* 重排 (Shuffle) */}
        <button
          onClick={onUseShuffle}
          disabled={shufflesLeft <= 0}
          className={`relative h-11 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            shufflesLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <RefreshCw className="w-3 h-3" />
          </div>
          <span className="text-xs sm:text-sm font-black text-[#5A381E]">重排</span>
          <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
            x{shufflesLeft}
          </span>
        </button>

        {/* 加时 / 冻结 (Freeze/Add Time) */}
        <button
          onClick={onUseFreeze}
          disabled={freezesLeft <= 0}
          className={`relative h-11 rounded-2xl bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            freezesLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
            <Clock className={`w-3 h-3 ${isFrozen ? 'animate-spin' : ''}`} />
          </div>
          <span className="text-xs sm:text-sm font-black text-[#5A381E]">
            {isFrozen ? '冰冻中' : '加时'}
          </span>
          <span className="absolute -bottom-1 -right-1 bg-[#6B482A] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
            x{freezesLeft}
          </span>
        </button>
      </div>

      {/* 3. MAIN LIANLIANKAN BOARD AREA (>70% Viewport Space) */}
      <main
        ref={boardContainerRef}
        className="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden z-10"
      >
        <ParticleCanvas ref={particleCanvasRef} />

        <LianLianKanBoard
          rows={level.rows}
          cols={level.cols}
          grid={grid}
          selectedTile={selectedTile}
          hintedPair={hintedPair}
          onTileClick={onTileClick}
          containerRef={boardContainerRef}
        />

        {/* Combo Popup */}
        {comboNotice && (
          <div
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-combo-pop"
            style={{ left: `${comboNotice.x}px`, top: `${comboNotice.y}px` }}
          >
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-sm sm:text-base px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
              <span>🐾</span>
              <span>{comboNotice.text}</span>
              <span className="text-yellow-200">+{comboNotice.bonus}</span>
            </div>
          </div>
        )}
      </main>

      {/* 4. BOTTOM PROGRESS TRACK */}
      <footer className="w-full pt-2 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex-1 h-10 bg-[#FFFDF8] border-2 border-[#6B482A] rounded-2xl p-1.5 shadow-[0_2px_0_#6B482A] flex items-center">
          <div className="w-full h-full bg-[#E8DCBF] border border-[#6B482A] rounded-xl p-0.5 overflow-hidden shadow-inner flex items-center">
            <div
              className="h-full bg-gradient-to-r from-[#A5D67D] to-[#86C852] border border-[#5E9B2F] rounded-lg transition-all duration-300 relative shadow-sm"
              style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
            >
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-lg pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="px-3 h-10 rounded-2xl bg-[#FFFDF8] border-2 border-[#6B482A] shadow-[0_2px_0_#6B482A] flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-[#5A381E] font-mono">
            分数: {score}
          </span>
        </div>
      </footer>
    </div>
  );
};
