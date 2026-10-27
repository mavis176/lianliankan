import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface CafeTopSceneProps {
  unlockedCount: number;
  onOpenRenovation: () => void;
  onPetCat: (catId: string, bonus: number) => void;
}

export const CafeTopScene: React.FC<CafeTopSceneProps> = ({
  unlockedCount,
  onOpenRenovation,
  onPetCat,
}) => {
  const [petPops, setPetPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const handleCatClick = (e: React.MouseEvent, catId: string, pitch: number, bonus: number) => {
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
        y: rect.top - 10,
        text: `+${bonus} 🪙 喵~`,
      },
    ]);

    setTimeout(() => {
      setPetPops(prev => prev.filter(p => p.id !== pid));
    }, 1100);
  };

  return (
    <div className="relative w-full h-[175px] sm:h-[195px] overflow-hidden rounded-2xl border-2 border-[#6B482A] shadow-[0_3px_0_#6B482A] bg-[#FAF3E7] shrink-0 select-none">
      {/* 100% Pure Vector Illustrated Cat Cafe Room (Zero external screenshots, Zero fake phone artifacts) */}
      <svg
        viewBox="0 0 500 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full pointer-events-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#F5E8D3" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2BE97" />
            <stop offset="100%" stopColor="#CFA476" />
          </linearGradient>
          <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DDF3FF" />
            <stop offset="100%" stopColor="#C3E9FF" />
          </linearGradient>
        </defs>

        {/* --- Background Walls --- */}
        <rect x="0" y="0" width="500" height="150" fill="url(#wallGrad)" />

        {/* --- Fairy Lights hanging from ceiling --- */}
        <path d="M 0 15 Q 120 40 250 18 Q 380 42 500 15" fill="none" stroke="#6B482A" strokeWidth="1" strokeDasharray="3,3" />
        {[40, 90, 145, 205, 260, 315, 375, 430, 480].map((cx, idx) => {
          const cy = 20 + Math.sin(idx * 0.8) * 8;
          return (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="3.5" fill="#FBBF24" opacity="0.9" />
              <circle cx={cx} cy={cy} r="6" fill="#FDE68A" opacity="0.4" />
            </g>
          );
        })}

        {/* --- Arched Sunny Window (Center-Left) --- */}
        <g transform="translate(170, 20)">
          <path d="M0 70 V35 A 35 35 0 0 1 70 35 V70 Z" fill="url(#windowSky)" stroke="#8C623E" strokeWidth="3" />
          {/* Tree Foliage outside */}
          <circle cx="20" cy="50" r="18" fill="#86EFAC" opacity="0.8" />
          <circle cx="50" cy="45" r="22" fill="#4ADE80" opacity="0.8" />
          <circle cx="35" cy="30" r="16" fill="#22C55E" opacity="0.7" />
          {/* Window Panes */}
          <line x1="35" y1="0" x2="35" y2="70" stroke="#8C623E" strokeWidth="2" />
          <line x1="0" y1="45" x2="70" y2="45" stroke="#8C623E" strokeWidth="2" />
          {/* Sill */}
          <rect x="-4" y="68" width="78" height="5" rx="2" fill="#8C623E" />
        </g>

        {/* --- Another Window (Right) --- */}
        <g transform="translate(420, 25)">
          <path d="M0 65 V30 A 30 30 0 0 1 60 30 V65 Z" fill="url(#windowSky)" stroke="#8C623E" strokeWidth="3" />
          <circle cx="25" cy="45" r="16" fill="#86EFAC" opacity="0.8" />
          <circle cx="45" cy="40" r="18" fill="#4ADE80" opacity="0.8" />
          <line x1="30" y1="0" x2="30" y2="65" stroke="#8C623E" strokeWidth="2" />
          <line x1="0" y1="40" x2="60" y2="40" stroke="#8C623E" strokeWidth="2" />
          <rect x="-3" y="63" width="66" height="5" rx="2" fill="#8C623E" />
        </g>

        {/* --- Wooden Floor with Perspective Planks --- */}
        <path d="M 0 120 L 500 100 L 500 240 L 0 240 Z" fill="url(#floorGrad)" />
        {/* Floorboard lines */}
        {[30, 80, 140, 200, 260, 320, 380, 440].map((x, i) => (
          <line key={i} x1={x} y1="110" x2={x - 40} y2="240" stroke="#B88A58" strokeWidth="1.2" opacity="0.6" />
        ))}
        <line x1="0" y1="160" x2="500" y2="150" stroke="#B88A58" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="200" x2="500" y2="190" stroke="#B88A58" strokeWidth="1" opacity="0.5" />

        {/* --- Coffee Bar & Counter (Left) --- */}
        <g transform="translate(15, 60)">
          {/* Back Cupboard */}
          <rect x="0" y="0" width="55" height="75" rx="4" fill="#B38659" stroke="#6B482A" strokeWidth="2" />
          <line x1="0" y1="25" x2="55" y2="25" stroke="#6B482A" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="55" y2="50" stroke="#6B482A" strokeWidth="1.5" />
          {/* Jars on shelf */}
          <rect x="6" y="8" width="10" height="13" rx="2" fill="#FAF6EE" stroke="#6B482A" strokeWidth="1" />
          <rect x="22" y="8" width="10" height="13" rx="2" fill="#E2E8F0" stroke="#6B482A" strokeWidth="1" />
          <rect x="38" y="8" width="10" height="13" rx="2" fill="#FAF6EE" stroke="#6B482A" strokeWidth="1" />
          {/* Coffee Bags */}
          <rect x="8" y="32" width="16" height="14" rx="2" fill="#D97706" />
          <rect x="30" y="32" width="16" height="14" rx="2" fill="#92400E" />

          {/* Espresso Machine */}
          <rect x="58" y="28" width="42" height="36" rx="3" fill="#CBD5E1" stroke="#6B482A" strokeWidth="2" />
          <rect x="64" y="34" width="30" height="14" rx="2" fill="#64748B" />
          {/* Steam */}
          <path d="M 72 24 Q 70 18 74 12" fill="none" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 84 24 Q 86 18 82 12" fill="none" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

          {/* Main Counter Table */}
          <path d="M 40 60 L 135 48 L 135 120 L 40 135 Z" fill="#9C6B3E" stroke="#6B482A" strokeWidth="2.5" />
          <polygon points="35,60 135,46 142,54 42,68" fill="#C59664" stroke="#6B482A" strokeWidth="2" />

          {/* Cake Display Cloche on Counter */}
          <ellipse cx="60" cy="62" rx="10" ry="3.5" fill="#E2E8F0" stroke="#6B482A" strokeWidth="1" />
          <path d="M 52 62 A 8 8 0 0 1 68 62 Z" fill="#F1F5F9" opacity="0.7" stroke="#6B482A" strokeWidth="1" />
          <circle cx="60" cy="54" r="1.5" fill="#6B482A" />
          <rect x="56" y="60" width="8" height="4" fill="#F472B6" />

          {/* Bar Stools */}
          <g transform="translate(60, 105)">
            <ellipse cx="0" cy="0" rx="9" ry="4" fill="#B38659" stroke="#6B482A" strokeWidth="1.5" />
            <line x1="-5" y1="3" x2="-8" y2="28" stroke="#6B482A" strokeWidth="2" />
            <line x1="5" y1="3" x2="8" y2="28" stroke="#6B482A" strokeWidth="2" />
            <line x1="0" y1="3" x2="0" y2="26" stroke="#6B482A" strokeWidth="2" />
          </g>
          <g transform="translate(95, 95)">
            <ellipse cx="0" cy="0" rx="9" ry="4" fill="#B38659" stroke="#6B482A" strokeWidth="1.5" />
            <line x1="-5" y1="3" x2="-8" y2="28" stroke="#6B482A" strokeWidth="2" />
            <line x1="5" y1="3" x2="8" y2="28" stroke="#6B482A" strokeWidth="2" />
            <line x1="0" y1="3" x2="0" y2="26" stroke="#6B482A" strokeWidth="2" />
          </g>
        </g>

        {/* --- Deluxe Multi-tier Cat Climbing Tree (Center-Right) --- */}
        <g transform="translate(250, 40)">
          {/* Main post */}
          <rect x="35" y="45" width="8" height="120" rx="2" fill="#8C623E" stroke="#6B482A" strokeWidth="1.5" />
          <rect x="75" y="70" width="8" height="95" rx="2" fill="#8C623E" stroke="#6B482A" strokeWidth="1.5" />

          {/* Base */}
          <rect x="20" y="160" width="75" height="10" rx="4" fill="#9C6B3E" stroke="#6B482A" strokeWidth="2" />

          {/* Lower House Box with Cat Hole */}
          <rect x="45" y="105" width="40" height="35" rx="6" fill="#C99A6B" stroke="#6B482A" strokeWidth="2" />
          <ellipse cx="65" cy="125" rx="9" ry="11" fill="#4A301A" />
          {/* Cat ears hole silhouette */}
          <path d="M 58 116 L 62 110 L 66 116 L 70 110 L 74 116" fill="#4A301A" />

          {/* Middle Perch Platform */}
          <ellipse cx="38" cy="80" rx="22" ry="7" fill="#D6AA7C" stroke="#6B482A" strokeWidth="2" />

          {/* Top Perch Platform */}
          <ellipse cx="78" cy="45" rx="24" ry="8" fill="#D6AA7C" stroke="#6B482A" strokeWidth="2" />

          {/* Cat 4: Sleeping Ginger Cat on top platform */}
          <g transform="translate(70, 32)">
            <ellipse cx="8" cy="6" rx="12" ry="7" fill="#F97316" stroke="#6B482A" strokeWidth="1.2" />
            <circle cx="16" cy="3" r="5" fill="#F97316" stroke="#6B482A" strokeWidth="1.2" />
            <polygon points="14,-2 17,2 12,2" fill="#F97316" stroke="#6B482A" strokeWidth="1" />
            <polygon points="18,-1 20,4 16,3" fill="#F97316" stroke="#6B482A" strokeWidth="1" />
            {/* Tail */}
            <path d="M -3 7 Q -9 11 -7 16" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>

        {/* --- Potted Plants in Corner --- */}
        <g transform="translate(220, 60)">
          <path d="M 5 25 L 0 45 L 20 45 L 15 25 Z" fill="#E2E8F0" stroke="#6B482A" strokeWidth="1.5" />
          {/* Leaves */}
          <ellipse cx="3" cy="20" rx="7" ry="12" fill="#22C55E" transform="rotate(-30 3 20)" stroke="#6B482A" strokeWidth="1" />
          <ellipse cx="17" cy="20" rx="7" ry="12" fill="#4ADE80" transform="rotate(30 17 20)" stroke="#6B482A" strokeWidth="1" />
          <ellipse cx="10" cy="14" rx="8" ry="14" fill="#16A34A" stroke="#6B482A" strokeWidth="1" />
        </g>

        {/* --- Cafe Table & Customers (Right Side) --- */}
        <g transform="translate(370, 90)">
          {/* Table */}
          <ellipse cx="35" cy="55" rx="22" ry="10" fill="#B38659" stroke="#6B482A" strokeWidth="2" />
          <rect x="33" y="62" width="4" height="25" fill="#6B482A" />
          <ellipse cx="35" cy="87" rx="10" ry="4" fill="#6B482A" />

          {/* Coffee Cups on Table */}
          <ellipse cx="30" cy="53" rx="3.5" ry="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />
          <ellipse cx="42" cy="54" rx="3.5" ry="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />

          {/* Customer Left (Girl in pink) */}
          <g transform="translate(10, 20)">
            <ellipse cx="0" cy="40" rx="11" ry="15" fill="#F472B6" stroke="#6B482A" strokeWidth="1.5" />
            <circle cx="0" cy="18" r="9" fill="#FFEDD5" stroke="#6B482A" strokeWidth="1.5" />
            {/* Hair */}
            <path d="M -9 18 C -9 10 9 10 9 18 C 9 24 5 26 0 26 C -5 26 -9 24 -9 18 Z" fill="#78350F" />
            {/* Eye & Smile */}
            <circle cx="2" cy="18" r="1" fill="#451A03" />
            <path d="M 0 21 Q 3 23 5 21" fill="none" stroke="#451A03" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* Customer Right (Boy in brown) */}
          <g transform="translate(60, 25)">
            <ellipse cx="0" cy="38" rx="12" ry="15" fill="#A16207" stroke="#6B482A" strokeWidth="1.5" />
            <circle cx="0" cy="18" r="9" fill="#FFEDD5" stroke="#6B482A" strokeWidth="1.5" />
            <path d="M -9 17 C -9 9 9 9 9 17 C 7 13 -7 13 -9 17 Z" fill="#451A03" />
            <circle cx="-2" cy="18" r="1" fill="#451A03" />
            <path d="M -4 21 Q -2 23 0 21" fill="none" stroke="#451A03" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>

        {/* --- Cats on the Floor --- */}
        {/* Cat 1: Orange Cat Stretching Front Paws (Center) */}
        <g transform="translate(225, 125)">
          {/* Back body angled up */}
          <ellipse cx="28" cy="8" rx="14" ry="10" fill="#EA580C" stroke="#6B482A" strokeWidth="1.5" />
          {/* Front body lowered stretching */}
          <ellipse cx="14" cy="16" rx="12" ry="7" fill="#F97316" stroke="#6B482A" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="4" cy="18" r="7" fill="#F97316" stroke="#6B482A" strokeWidth="1.5" />
          <polygon points="1,12 4,16 0,16" fill="#F97316" stroke="#6B482A" strokeWidth="1" />
          <polygon points="6,12 8,16 4,16" fill="#F97316" stroke="#6B482A" strokeWidth="1" />
          {/* Extended front paws */}
          <rect x="-6" y="21" width="10" height="4" rx="2" fill="#FED7AA" stroke="#6B482A" strokeWidth="1" />
          {/* Upright tail */}
          <path d="M 40 5 Q 46 -6 42 -12" fill="none" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
          {/* Stripes */}
          <path d="M 22 2 Q 24 8 22 14" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 30 1 Q 32 8 30 15" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Cat 2: Calico Cat Strolling (Lower Right) */}
        <g transform="translate(255, 175)">
          {/* White body */}
          <ellipse cx="18" cy="10" rx="16" ry="10" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.5" />
          {/* Ginger patch */}
          <path d="M 12 1 Q 20 2 22 10 Q 16 14 12 1 Z" fill="#F97316" />
          {/* Dark patch */}
          <path d="M 24 3 Q 32 4 30 12 Q 26 12 24 3 Z" fill="#334155" />
          {/* Head */}
          <circle cx="4" cy="6" r="7.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1.5" />
          <path d="M 0 1 Q 4 1 5 7 Q 1 7 0 1 Z" fill="#F97316" />
          <polygon points="0,0 3,4 -1,3" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />
          <polygon points="6,0 8,5 4,4" fill="#334155" stroke="#6B482A" strokeWidth="1" />
          {/* Legs */}
          <rect x="8" y="16" width="3.5" height="9" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />
          <rect x="15" y="16" width="3.5" height="9" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />
          <rect x="24" y="16" width="3.5" height="9" rx="1.5" fill="#FFFDF8" stroke="#6B482A" strokeWidth="1" />
          {/* Curled Tail */}
          <path d="M 32 10 Q 42 6 38 -2" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Cat 3: Curled up Ginger cat napping (Lower Center-Left) */}
        <g transform="translate(180, 170)">
          <ellipse cx="15" cy="12" rx="15" ry="11" fill="#F59E0B" stroke="#6B482A" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="6" fill="#FBBF24" stroke="#6B482A" strokeWidth="1.2" />
          <polygon points="4,3 7,7 3,6" fill="#F59E0B" stroke="#6B482A" strokeWidth="1" />
          <polygon points="9,3 11,7 8,6" fill="#F59E0B" stroke="#6B482A" strokeWidth="1" />
          {/* Tail wrapped around */}
          <path d="M 28 14 Q 30 22 18 22" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sleeping eyes */}
          <path d="M 6 9 Q 8 11 10 9" fill="none" stroke="#6B482A" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>

      {/* Interactive Cat Petting Hotspots */}
      <button
        onClick={e => handleCatClick(e, 'pudding', 480, 5)}
        className="absolute top-[48%] left-[42%] w-16 h-12 rounded-full cursor-pointer group flex items-center justify-center z-10"
        title="抚摸伸懒腰的橘猫「布丁」"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#6B482A] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow border border-amber-300 -translate-y-5">
          布丁 🐾
        </span>
      </button>

      <button
        onClick={e => handleCatClick(e, 'dango', 640, 8)}
        className="absolute bottom-2 left-[50%] w-16 h-12 rounded-full cursor-pointer group flex items-center justify-center z-10"
        title="抚摸漫步的三花猫「团子」"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#6B482A] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow border border-pink-300 -translate-y-5">
          团子 🐾
        </span>
      </button>

      <button
        onClick={e => handleCatClick(e, 'ginger', 780, 10)}
        className="absolute top-2 right-[20%] w-14 h-12 rounded-full cursor-pointer group flex items-center justify-center z-10"
        title="抚摸猫爬架顶层咪咪"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#6B482A] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow border border-orange-300 -translate-y-4">
          咪咪 🐾
        </span>
      </button>

      {/* Top Left: Renovation Quick Button */}
      <button
        onClick={onOpenRenovation}
        className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 bg-[#FFFDF8]/95 hover:bg-white border-2 border-[#6B482A] px-2.5 py-1 rounded-full shadow-[0_2px_0_#6B482A] text-[11px] font-black text-[#5A381E] cursor-pointer active:translate-y-0.5 active:shadow-none transition-all"
      >
        <span>🔨 咖啡馆装潢</span>
        <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono">
          {unlockedCount}/10
        </span>
      </button>

      {/* Floating Petting Heart / Coin Reaction */}
      {petPops.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-xs font-black text-amber-700 bg-white/95 px-2 py-0.5 rounded-full shadow-md border border-amber-300 animate-float-up"
          style={{ left: `${p.x - 20}px`, top: `${p.y}px` }}
        >
          {p.text}
        </div>
      ))}

      {/* Bottom Wood Border Rim */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#6B482A]" />
    </div>
  );
};
