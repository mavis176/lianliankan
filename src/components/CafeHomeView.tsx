import React, { useState } from 'react';
import { Star, Coins, Volume2, VolumeX, Hammer, Play, Settings, Download } from 'lucide-react';
import { RENOVATION_ITEMS } from '../data/cafeData';
import { sound } from '../utils/audio';

interface CafeHomeViewProps {
  stars: number;
  coins: number;
  unlockedItems: Set<string>;
  currentLevelId: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRenovation: () => void;
  onStartLevel: () => void;
  onPetCat: (catId: string, bonus: number) => void;
  onOpenPause: () => void;
  onOpenExport?: () => void;
}

export const CafeHomeView: React.FC<CafeHomeViewProps> = ({
  stars,
  coins,
  unlockedItems,
  currentLevelId,
  soundEnabled,
  onToggleSound,
  onOpenRenovation,
  onStartLevel,
  onPetCat,
  onOpenPause,
  onOpenExport,
}) => {
  const [petPops, setPetPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Check if player can afford the next renovation item
  const nextItem = RENOVATION_ITEMS.find(item => !unlockedItems.has(item.id));
  const hasAffordableUpgrade = nextItem && stars >= nextItem.costStars && coins >= nextItem.costCoins;

  const handleCatTap = (e: React.MouseEvent, catId: string, pitch: number, bonus: number) => {
    e.stopPropagation();
    sound.ensureContext();
    sound.playMeow(pitch);
    sound.playCoin();
    onPetCat(catId, bonus);

    const rect = e.currentTarget.getBoundingClientRect();
    const pid = Date.now() + Math.random();
    setPetPops(prev => [
      ...prev,
      {
        id: pid,
        x: rect.left + rect.width / 2,
        y: rect.top - 15,
        text: `+${bonus} 🪙 💖`,
      },
    ]);

    setTimeout(() => {
      setPetPops(prev => prev.filter(p => p.id !== pid));
    }, 1100);
  };

  const hasFloor = unlockedItems.has('task_floor') || unlockedItems.has('task_clean');
  const hasBar = unlockedItems.has('task_bar');
  const hasCoffeeMachine = unlockedItems.has('task_cattree') || unlockedItems.has('task_bar'); // stage 3
  const hasCat1 = unlockedItems.has('task_cat1');
  const hasCatTree = unlockedItems.has('task_cattree');
  const hasCat2 = unlockedItems.has('task_cat2') || unlockedItems.has('task_plant');
  const hasTable = unlockedItems.has('task_couch') || unlockedItems.has('task_rug_table');
  const hasCustomers = unlockedItems.has('task_neon_sign') || unlockedItems.has('task_rug_table');

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FAF5EE] select-none font-sans">
      {/* 1. TOP STATUS BAR (Stars, Coins, Settings) */}
      <header className="w-full px-4 pt-3 pb-2 flex items-center justify-between shrink-0 z-20">
        {/* Currency Pills */}
        <div className="flex items-center gap-2.5">
          {/* Star Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-[#6B482A] px-3 py-1 rounded-full shadow-[0_2px_0_#6B482A]">
            <span className="text-base leading-none drop-shadow-sm">⭐</span>
            <span className="text-sm font-black text-[#5A381E] font-mono">{stars}</span>
          </div>

          {/* Coin Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-[#6B482A] px-3 py-1 rounded-full shadow-[0_2px_0_#6B482A]">
            <div className="w-4 h-4 rounded-full bg-amber-400 border border-[#6B482A] flex items-center justify-center text-[10px] leading-none shadow-inner">
              🐾
            </div>
            <span className="text-sm font-black text-[#5A381E] font-mono">{coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="w-9 h-9 rounded-full bg-[#FFFDF8] hover:bg-[#F6EFE6] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              title="导出单文件 HTML (Single-file Export)"
            >
              <Download className="w-4 h-4 text-[#6B482A]" />
            </button>
          )}

          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-full bg-[#FFFDF8] hover:bg-[#F6EFE6] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={soundEnabled ? '音效开启' : '静音'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#6B482A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          <button
            onClick={onOpenPause}
            className="w-9 h-9 rounded-full bg-[#FFFDF8] hover:bg-[#F6EFE6] border-2 border-[#6B482A] flex items-center justify-center shadow-[0_2px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="设置与说明"
          >
            <Settings className="w-4 h-4 text-[#6B482A]" />
          </button>
        </div>
      </header>

      {/* 2. FULL-SCREEN PANORAMIC CAT CAFE ROOM (Centered & Responsive) */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {/* Full Viewport Vector Illustrated Cafe Scene */}
        <svg
          viewBox="0 0 540 380"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="cafeWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF9" />
              <stop offset="100%" stopColor="#F5E8D3" />
            </linearGradient>
            <linearGradient id="oakFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2BE97" />
              <stop offset="100%" stopColor="#CFA476" />
            </linearGradient>
            <linearGradient id="dustyFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4CDC3" />
              <stop offset="100%" stopColor="#B5ADA3" />
            </linearGradient>
            <linearGradient id="windowSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DDF3FF" />
              <stop offset="100%" stopColor="#C3E9FF" />
            </linearGradient>
          </defs>

          {/* Background Wall */}
          <rect x="0" y="0" width="540" height="210" fill="url(#cafeWall)" />

          {/* Hanging Fairy Lights */}
          <path d="M 0 20 Q 135 50 270 25 Q 405 52 540 20" fill="none" stroke="#6B482A" strokeWidth="1.2" strokeDasharray="4,4" />
          {[40, 95, 155, 215, 270, 325, 385, 445, 500].map((cx, idx) => {
            const cy = 25 + Math.sin(idx * 0.75) * 10;
            return (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="4" fill="#FBBF24" />
                <circle cx={cx} cy={cy} r="7" fill="#FDE68A" opacity="0.4" />
              </g>
            );
          })}

          {/* Arched Sunny Windows (Center & Right) */}
          <g transform="translate(180, 30)">
            <path d="M0 95 V45 A 45 45 0 0 1 90 45 V95 Z" fill="url(#windowSkyGrad)" stroke="#8C623E" strokeWidth="3.5" />
            <circle cx="25" cy="70" r="22" fill="#86EFAC" opacity="0.8" />
            <circle cx="65" cy="65" r="26" fill="#4ADE80" opacity="0.8" />
            <line x1="45" y1="0" x2="45" y2="95" stroke="#8C623E" strokeWidth="2.5" />
            <line x1="0" y1="60" x2="90" y2="60" stroke="#8C623E" strokeWidth="2.5" />
            <rect x="-6" y="92" width="102" height="6" rx="2" fill="#8C623E" />
          </g>

          <g transform="translate(440, 35)">
            <path d="M0 90 V40 A 40 40 0 0 1 80 40 V90 Z" fill="url(#windowSkyGrad)" stroke="#8C623E" strokeWidth="3.5" />
            <circle cx="40" cy="60" r="25" fill="#4ADE80" opacity="0.8" />
            <line x1="40" y1="0" x2="40" y2="90" stroke="#8C623E" strokeWidth="2.5" />
            <line x1="0" y1="55" x2="80" y2="55" stroke="#8C623E" strokeWidth="2.5" />
            <rect x="-4" y="87" width="88" height="6" rx="2" fill="#8C623E" />
          </g>

          {/* Floor: Dusty vs Warm Parquet Oak Floorboards */}
          <path d="M 0 180 L 540 150 L 540 380 L 0 380 Z" fill={hasFloor ? 'url(#oakFloor)' : 'url(#dustyFloor)'} />
          {hasFloor ? (
            // Rich Oak Plank Lines
            <>
              {[40, 100, 170, 240, 310, 380, 450, 510].map((x, i) => (
                <line key={i} x1={x} y1="165" x2={x - 60} y2="380" stroke="#B88A58" strokeWidth="1.5" opacity="0.65" />
              ))}
              <line x1="0" y1="230" x2="540" y2="215" stroke="#B88A58" strokeWidth="1.2" opacity="0.5" />
              <line x1="0" y1="290" x2="540" y2="275" stroke="#B88A58" strokeWidth="1.2" opacity="0.5" />
              <line x1="0" y1="340" x2="540" y2="325" stroke="#B88A58" strokeWidth="1.2" opacity="0.5" />
            </>
          ) : (
            // Dusty Cardboard Boxes (Initial State)
            <g transform="translate(200, 240)">
              <rect x="0" y="0" width="45" height="35" rx="3" fill="#C4A482" stroke="#6B482A" strokeWidth="1.5" />
              <line x1="22" y1="0" x2="22" y2="35" stroke="#6B482A" strokeWidth="1" strokeDasharray="3,3" />
              <rect x="55" y="10" width="35" height="25" rx="3" fill="#BFA07E" stroke="#6B482A" strokeWidth="1.5" />
              <text x="70" y="27" fontSize="12" textAnchor="middle" fill="#6B482A">📦</text>
            </g>
          )}

          {/* Stage 2 & 3: Cafe Bar Counter & Espresso Machine */}
          {hasBar && (
            <g transform="translate(20, 80)">
              {/* Cupboard Shelf */}
              <rect x="0" y="0" width="65" height="95" rx="4" fill="#B38659" stroke="#6B482A" strokeWidth="2.5" />
              <line x1="0" y1="32" x2="65" y2="32" stroke="#6B482A" strokeWidth="2" />
              <line x1="0" y1="64" x2="65" y2="64" stroke="#6B482A" strokeWidth="2" />
              <rect x="8" y="10" width="12" height="16" rx="2" fill="#FAF6EE" stroke="#6B482A" strokeWidth="1.2" />
              <rect x="26" y="10" width="12" height="16" rx="2" fill="#E2E8F0" stroke="#6B482A" strokeWidth="1.2" />
              <rect x="44" y="10" width="12" height="16" rx="2" fill="#FAF6EE" stroke="#6B482A" strokeWidth="1.2" />

              {/* Espresso Machine (with animated steam) */}
              {hasCoffeeMachine && (
                <g transform="translate(70, 36)">
                  <rect x="0" y="0" width="48" height="42" rx="4" fill="#CBD5E1" stroke="#6B482A" strokeWidth="2.5" />
                  <rect x="6" y="8" width="36" height="16" rx="2" fill="#64748B" />
                  <circle cx="14" cy="30" r="3" fill="#D97706" />
                  <circle cx="24" cy="30" r="3" fill="#D97706" />
                  {/* Steam */}
                  <path d="M 16 -4 Q 12 -12 18 -20" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
                  <path d="M 32 -4 Q 36 -12 30 -20" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
                </g>
              )}

              {/* Bar Counter Desk */}
              <path d="M 45 75 L 155 60 L 155 155 L 45 175 Z" fill="#9C6B3E" stroke="#6B482A" strokeWidth="3" />
              <polygon points="40,75 155,58 165,68 48,86" fill="#C59664" stroke="#6B482A" strokeWidth="2.5" />

              {/* Stools */}
              <g transform="translate(70, 135)">
                <ellipse cx="0" cy="0" rx="11" ry="5" fill="#B38659" stroke="#6B482A" strokeWidth="2" />
                <line x1="-7" y1="4" x2="-10" y2="35" stroke="#6B482A" strokeWidth="2.5" />
                <line x1="7" y1="4" x2="10" y2="35" stroke="#6B482A" strokeWidth="2.5" />
              </g>
              <g transform="translate(115, 120)">
                <ellipse cx="0" cy="0" rx="11" ry="5" fill="#B38659" stroke="#6B482A" strokeWidth="2" />
                <line x1="-7" y1="4" x2="-10" y2="35" stroke="#6B482A" strokeWidth="2.5" />
                <line x1="7" y1="4" x2="10" y2="35" stroke="#6B482A" strokeWidth="2.5" />
              </g>
            </g>
          )}

          {/* Stage 5: Cat Climbing Tree */}
          {hasCatTree && (
            <g transform="translate(265, 55)">
              <rect x="40" y="55" width="10" height="155" rx="2" fill="#8C623E" stroke="#6B482A" strokeWidth="2" />
              <rect x="85" y="85" width="10" height="125" rx="2" fill="#8C623E" stroke="#6B482A" strokeWidth="2" />
              <rect x="25" y="200" width="90" height="12" rx="4" fill="#9C6B3E" stroke="#6B482A" strokeWidth="2.5" />
              {/* Box House */}
              <rect x="50" y="130" width="48" height="42" rx="6" fill="#C99A6B" stroke="#6B482A" strokeWidth="2.5" />
              <ellipse cx="74" cy="154" rx="11" ry="13" fill="#4A301A" />
              {/* Platforms */}
              <ellipse cx="45" cy="98" rx="26" ry="9" fill="#D6AA7C" stroke="#6B482A" strokeWidth="2.5" />
              <ellipse cx="90" cy="58" rx="28" ry="10" fill="#D6AA7C" stroke="#6B482A" strokeWidth="2.5" />
            </g>
          )}

          {/* Stage 4: Cat 1 (Orange Tabby "布丁" stretching on floor) */}
          {hasCat1 && (
            <g transform="translate(235, 175)">
              <ellipse cx="32" cy="10" rx="17" ry="12" fill="#EA580C" stroke="#6B482A" strokeWidth="2" />
              <ellipse cx="16" cy="19" rx="14" ry="9" fill="#F97316" stroke="#6B482A" strokeWidth="2" />
              <circle cx="5" cy="21" r="8.5" fill="#F97316" stroke="#6B482A" strokeWidth="2" />
              <polygon points="1,14 5,19 0,19" fill="#F97316" stroke="#6B482A" strokeWidth="1.2" />
              <polygon points="7,14 10,19 5,19" fill="#F97316" stroke="#6B482A" strokeWidth="1.2" />
              <rect x="-7" y="25" width="12" height="5" rx="2" fill="#FED7AA" stroke="#6B482A" strokeWidth="1.2" />
              <path d="M 46 6 Q 54 -6 48 -14" fill="none" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          {/* Stage 6: Cat 2 (Calico Cat "团子" walking) */}
          {hasCat2 && (
            <g transform="translate(285, 240)">
              <ellipse cx="20" cy="12" rx="18" ry="11" fill="#FFFDF8" stroke="#6B482A" strokeWidth="2" />
              <path d="M 14 2 Q 23 3 25 12 Q 18 16 14 2 Z" fill="#F97316" />
              <path d="M 27 4 Q 36 5 34 14 Q 29 14 27 4 Z" fill="#334155" />
              <circle cx="4" cy="7" r="8.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="2" />
              <polygon points="-1,0 3,4 -2,4" fill="#F97316" stroke="#6B482A" strokeWidth="1" />
              <polygon points="6,0 9,5 5,4" fill="#334155" stroke="#6B482A" strokeWidth="1" />
              <rect x="9" y="19" width="4" height="11" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.2" />
              <rect x="17" y="19" width="4" height="11" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.2" />
              <rect x="27" y="19" width="4" height="11" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.2" />
              <path d="M 36 12 Q 47 7 42 -2" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* Stage 7: Round Tea Table & Chairs by the Window */}
          {hasTable && (
            <g transform="translate(390, 115)">
              <ellipse cx="40" cy="65" rx="26" ry="12" fill="#B38659" stroke="#6B482A" strokeWidth="2.5" />
              <rect x="38" y="73" width="5" height="30" fill="#6B482A" />
              <ellipse cx="40" cy="103" rx="12" ry="5" fill="#6B482A" />
              {/* Coffee Cups */}
              <ellipse cx="34" cy="62" rx="4" ry="2" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.2" />
              <ellipse cx="48" cy="64" rx="4" ry="2" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.2" />
            </g>
          )}

          {/* Stage 8: Customers Sitting and Drinking Coffee */}
          {hasCustomers && (
            <g transform="translate(390, 115)">
              {/* Girl */}
              <g transform="translate(12, 25)">
                <ellipse cx="0" cy="46" rx="13" ry="18" fill="#F472B6" stroke="#6B482A" strokeWidth="2" />
                <circle cx="0" cy="20" r="10" fill="#FFEDD5" stroke="#6B482A" strokeWidth="2" />
                <path d="M -10 20 C -10 10 10 10 10 20 C 10 27 6 29 0 29 C -6 29 -10 27 -10 20 Z" fill="#78350F" />
                <circle cx="3" cy="20" r="1.2" fill="#451A03" />
              </g>
              {/* Boy */}
              <g transform="translate(68, 30)">
                <ellipse cx="0" cy="44" rx="14" ry="18" fill="#A16207" stroke="#6B482A" strokeWidth="2" />
                <circle cx="0" cy="20" r="10" fill="#FFEDD5" stroke="#6B482A" strokeWidth="2" />
                <path d="M -10 19 C -10 9 10 9 10 19 C 8 14 -8 14 -10 19 Z" fill="#451A03" />
                <circle cx="-3" cy="20" r="1.2" fill="#451A03" />
              </g>
            </g>
          )}
        </svg>

        {/* Interactive Cat Petting Hotspots */}
        {hasCat1 && (
          <button
            onClick={e => handleCatTap(e, 'pudding', 480, 5)}
            className="absolute bottom-[28%] left-[44%] w-16 h-14 rounded-full cursor-pointer group flex items-center justify-center z-10"
            title="抚摸伸懒腰的橘猫「布丁」"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#6B482A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-amber-300 -translate-y-5">
              布丁 🐾
            </span>
          </button>
        )}

        {hasCat2 && (
          <button
            onClick={e => handleCatTap(e, 'dango', 640, 8)}
            className="absolute bottom-[16%] left-[54%] w-16 h-14 rounded-full cursor-pointer group flex items-center justify-center z-10"
            title="抚摸漫步的三花猫「团子」"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#6B482A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-pink-300 -translate-y-5">
              团子 🐾
            </span>
          </button>
        )}

        {/* Floating Renovation Progress Button (Left) */}
        <button
          onClick={onOpenRenovation}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#FFFDF8] hover:bg-[#FAF3E8] border-2 border-[#6B482A] px-3.5 py-2 rounded-2xl shadow-[0_3px_0_#6B482A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group"
        >
          <div className="relative">
            <Hammer className="w-5 h-5 text-[#8C623E] group-hover:rotate-12 transition-transform" />
            {hasAffordableUpgrade && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            )}
            {hasAffordableUpgrade && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            )}
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xs font-black text-[#5A381E]">装修计划</span>
            <span className="text-[10px] font-bold text-amber-700 font-mono mt-0.5">
              {unlockedItems.size}/{RENOVATION_ITEMS.length} 已解锁
            </span>
          </div>
        </button>

        {/* Floating Petting Heart Reaction */}
        {petPops.map(p => (
          <div
            key={p.id}
            className="fixed pointer-events-none z-50 text-xs font-black text-amber-800 bg-white/95 px-2.5 py-0.5 rounded-full shadow-md border border-amber-300 animate-float-up"
            style={{ left: `${p.x - 24}px`, top: `${p.y}px` }}
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* 3. BOTTOM ACTION BAR: ENORMOUS EYE-CATCHING START LEVEL BUTTON */}
      <footer className="w-full px-4 pb-4 pt-2 flex items-center justify-center shrink-0 z-20">
        <button
          onClick={onStartLevel}
          className="w-full max-w-sm h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 border-2 border-[#6B482A] shadow-[0_4px_0_#6B482A] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span className="text-xl group-hover:scale-125 transition-transform animate-bounce">🐾</span>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-[#4A2E18] tracking-wide">
              开始营业 / 闯关
            </span>
            <span className="bg-[#6B482A] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border border-white/50">
              Level {currentLevelId}
            </span>
          </div>
          <Play className="w-4 h-4 fill-[#4A2E18] text-[#4A2E18]" />
        </button>
      </footer>
    </div>
  );
};
