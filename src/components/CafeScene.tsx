import React, { useState } from 'react';
import { Sparkles, Heart, Coffee, Coins } from 'lucide-react';
import { sound } from '../utils/audio';

interface CafeSceneProps {
  unlockedItems: Set<string>;
  idleCoins: number;
  onCollectIdleCoins: () => void;
  onPetCat: (catId: string, bonusCoins: number) => void;
}

export const CafeScene: React.FC<CafeSceneProps> = ({
  unlockedItems,
  idleCoins,
  onCollectIdleCoins,
  onPetCat,
}) => {
  const [petEffects, setPetEffects] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const triggerPetReaction = (e: React.MouseEvent, catId: string, bonus: number, meowPitch: number) => {
    e.stopPropagation();
    sound.ensureContext();
    sound.playMeow(meowPitch);
    sound.playCoin();
    onPetCat(catId, bonus);

    const rect = e.currentTarget.getBoundingClientRect();
    const effectId = Date.now() + Math.random();
    setPetEffects(prev => [
      ...prev,
      {
        id: effectId,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        text: `+${bonus} 🪙 喵~`,
      },
    ]);

    setTimeout(() => {
      setPetEffects(prev => prev.filter(p => p.id !== effectId));
    }, 1200);
  };

  const hasCleaned = unlockedItems.has('task_clean');
  const hasFloor = unlockedItems.has('task_floor');
  const hasBar = unlockedItems.has('task_bar');
  const hasCatTree = unlockedItems.has('task_cattree');
  const hasCat1 = unlockedItems.has('task_cat1');
  const hasCouch = unlockedItems.has('task_couch');
  const hasPlant = unlockedItems.has('task_plant');
  const hasCat2 = unlockedItems.has('task_cat2');
  const hasRug = unlockedItems.has('task_rug_table');
  const hasSign = unlockedItems.has('task_neon_sign');

  return (
    <div className="relative w-full h-full min-h-[480px] max-h-[640px] rounded-3xl overflow-hidden border border-amber-900/10 shadow-2xl bg-amber-50/50 select-none flex flex-col justify-between">
      {/* Background Wall & Window */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F3ECE2]">
        {/* Subtle Wallpaper Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D97706 0.8px, transparent 0.8px), radial-gradient(#D97706 0.8px, #FAF5EE 0.8px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Large Sunlit Arched Window */}
        <div className="absolute top-6 left-12 md:left-24 w-32 md:w-44 h-48 md:h-60 rounded-t-full border-4 border-amber-800/20 bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100/60 shadow-inner overflow-hidden">
          {/* Sunlight Rays */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 via-yellow-100/20 to-transparent pointer-events-none" />
          {/* Window Frame Panes */}
          <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-800/20" />
          <div className="absolute inset-y-0 left-1/2 w-1 bg-amber-800/20" />
          {/* Gentle Curtains */}
          <div className="absolute top-0 left-0 w-8 h-full bg-amber-100/80 rounded-r-2xl border-r border-amber-300/40" />
          <div className="absolute top-0 right-0 w-8 h-full bg-amber-100/80 rounded-l-2xl border-l border-amber-300/40" />
        </div>

        {/* Cafe Neon / Wooden Sign on Wall */}
        {hasSign ? (
          <div className="absolute top-5 right-12 md:right-28 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-400/20 to-pink-500/20 border-2 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.4)] backdrop-blur-sm animate-pulse flex items-center gap-2">
            <span className="text-amber-500 text-lg">🐾</span>
            <div className="text-center">
              <div className="text-xs font-black tracking-widest text-amber-700 uppercase">WARM PURR CAFE</div>
              <div className="text-xs font-bold text-amber-600">暖喵咖啡馆 · 营业中</div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        ) : (
          <div className="absolute top-8 right-16 px-4 py-1.5 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-medium">
            (未装潢招牌)
          </div>
        )}

        {/* Ambient Wall Lamp */}
        {hasPlant && (
          <div className="absolute top-16 right-6 md:right-16 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-amber-300/60 blur-md absolute -top-1" />
            <div className="w-6 h-6 rounded-t-full bg-amber-400 border border-amber-600/30 shadow-md" />
            <div className="w-1.5 h-6 bg-amber-800/40" />
          </div>
        )}
      </div>

      {/* Room Floor (Changes from Dusty Rubble to Shiny Warm Oak) */}
      <div className="absolute inset-x-0 bottom-0 h-44 md:h-52 z-10 transition-colors duration-500">
        {hasFloor ? (
          // Luxury Warm Oak Wood Floor
          <div className="w-full h-full bg-[#E8C59A] border-t-4 border-[#C89F70] shadow-inner relative overflow-hidden">
            {/* Wooden Planks Pattern */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #8B5A2B 0, #8B5A2B 2px, transparent 2px, transparent 60px)',
              }}
            />
            {/* Subtle wood sheen highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
          </div>
        ) : (
          // Run-down, cracked, dusty grey floor
          <div className="w-full h-full bg-[#C5C0B8] border-t-4 border-[#9C968C] relative p-4">
            <div className="text-xs font-semibold text-stone-500/80 bg-stone-200/60 px-3 py-1 rounded-full inline-block">
              {hasCleaned ? '破旧待翻修地面' : '杂物堆积 · 待清扫'}
            </div>
          </div>
        )}
      </div>

      {/* BEFORE CLEANUP: Messy Debris Layer */}
      {!hasCleaned && (
        <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-20 flex items-center justify-around px-8 pointer-events-none">
          <div className="text-3xl opacity-70 animate-bounce">📦</div>
          <div className="text-2xl opacity-60">🧱</div>
          <div className="text-3xl opacity-80">🧹</div>
          <div className="text-2xl opacity-60">🕸️</div>
          <div className="text-3xl opacity-75">🪵</div>
        </div>
      )}

      {/* ================= FURNITURE ITEMS ================= */}

      {/* 1. Deluxe Multi-tier Cat Climbing Tree (Left side) */}
      {hasCatTree && (
        <div className="absolute bottom-16 md:bottom-20 left-4 md:left-10 z-20 flex flex-col items-center drop-shadow-lg">
          {/* Top Perch Platform with Cat 2 ("团子") if adopted */}
          <div className="relative w-28 md:w-36 h-10 rounded-2xl bg-amber-700/80 border-2 border-amber-600 flex items-center justify-center text-xs font-bold text-amber-100 shadow-md">
            <span className="text-amber-200 text-[10px]">观景露台</span>
            {/* Cat 2 perched on top platform! */}
            {hasCat2 && (
              <button
                onClick={e => triggerPetReaction(e, 'dango', 8, 120)}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                title="抚摸三花猫「团子」"
              >
                <span className="text-3xl transition-transform group-hover:scale-125 animate-pulse">
                  🐈
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-white/90 px-1.5 py-0.2 rounded-full shadow-sm">
                  团子
                </span>
              </button>
            )}
          </div>

          {/* Middle Sisal Posts & Hammock */}
          <div className="w-4 h-16 bg-amber-800/80 border-x border-amber-900 my-0.5 relative flex items-center justify-center">
            {/* Swinging Toy Ball */}
            <div className="absolute left-6 top-3 flex flex-col items-center animate-bounce">
              <div className="w-0.5 h-6 bg-slate-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-pink-400 shadow-sm" />
            </div>
          </div>

          {/* Middle Cabin Platform */}
          <div className="w-24 md:w-28 h-12 rounded-xl bg-amber-800/90 border border-amber-700 flex items-center justify-center text-[10px] text-amber-200">
            🐱 萌爪树屋
          </div>

          {/* Base Stand */}
          <div className="w-6 h-10 bg-amber-800/80" />
          <div className="w-32 md:w-40 h-4 rounded-full bg-amber-900/90 border border-amber-800 shadow" />
        </div>
      )}

      {/* 2. Cozy Carpet & Low Tea Table (Center) */}
      {hasRug && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          {/* Paw Shaped Rug */}
          <div className="w-48 md:w-64 h-24 md:h-28 rounded-full bg-gradient-to-r from-orange-200/90 to-amber-200/90 border-2 border-amber-300 shadow-md flex items-center justify-center relative">
            <span className="text-4xl text-amber-500/30">🐾</span>
            {/* Tea Table on top */}
            <div className="absolute -top-3 w-28 md:w-36 h-10 md:h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-md flex items-center justify-around px-2">
              <span className="text-sm" title="猫咪牛奶碟">🥛</span>
              <span className="text-xs font-bold text-amber-800">下午茶</span>
              <span className="text-sm" title="草莓曲奇">🍪</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Orange Tabby Cat "布丁" Snoozing on Floor or Rug */}
      {hasCat1 && (
        <button
          onClick={e => triggerPetReaction(e, 'pudding', 5, 0)}
          className="absolute bottom-12 md:bottom-16 left-[42%] md:left-[45%] z-25 flex flex-col items-center group cursor-pointer drop-shadow-md"
          title="抚摸橘猫「布丁」"
        >
          <div className="relative">
            <span className="text-4xl transition-transform group-hover:scale-125 inline-block group-hover:-translate-y-1">
              🐱
            </span>
            <span className="absolute -top-1 -right-2 text-xs text-rose-500 animate-pulse">
              💤
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-900 bg-white/95 px-2 py-0.5 rounded-full shadow border border-amber-200">
            布丁 · 呼噜中
          </span>
        </button>
      )}

      {/* 4. Soft Couch (Center-Right) */}
      {hasCouch && (
        <div className="absolute bottom-16 md:bottom-22 right-36 md:right-60 z-20 flex flex-col items-center drop-shadow-md">
          {/* Sofa Backrest */}
          <div className="w-32 md:w-44 h-16 md:h-20 rounded-t-3xl bg-gradient-to-b from-[#C97A52] to-[#B3633C] border-2 border-[#9C4E2A] flex items-center justify-around px-2 shadow-inner">
            <div className="w-8 h-8 rounded-full bg-amber-100/90 shadow text-xs flex items-center justify-center">
              🛋️
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100/90 shadow text-xs flex items-center justify-center">
              🧶
            </div>
          </div>
          {/* Sofa Seat Cushion */}
          <div className="w-36 md:w-48 h-10 md:h-12 rounded-xl bg-[#B3633C] border-2 border-[#8E4321] shadow flex items-center justify-center">
            <div className="w-11/12 h-2 rounded-full bg-black/10" />
          </div>
          {/* Sofa Wooden Legs */}
          <div className="w-full flex justify-between px-3">
            <div className="w-2 h-4 bg-amber-900 rounded-b" />
            <div className="w-2 h-4 bg-amber-900 rounded-b" />
          </div>
        </div>
      )}

      {/* 5. Coffee Bar & Espresso Counter (Right side) */}
      {hasBar && (
        <div className="absolute bottom-12 md:bottom-16 right-2 md:right-8 z-20 flex flex-col items-center drop-shadow-xl">
          {/* Top Bar Shelf */}
          <div className="w-32 md:w-40 h-10 rounded-t-xl bg-amber-800 border-2 border-amber-700 flex items-center justify-around px-2 shadow">
            {/* Espresso Machine */}
            <div className="flex items-center gap-1">
              <span className="text-base" title="意式咖啡机">☕</span>
              <span className="text-xs text-amber-200 font-mono">92℃</span>
            </div>
            {/* Steam Animation */}
            <span className="text-xs text-slate-300 animate-pulse">♨️</span>
          </div>

          {/* Bar Counter Front Panel */}
          <div className="w-36 md:w-44 h-24 md:h-28 bg-gradient-to-b from-amber-900 to-[#4A2E18] border-2 border-amber-800 rounded-b-xl flex flex-col items-center justify-between p-2 shadow-inner">
            <div className="w-full bg-amber-950/80 rounded-lg py-1 px-2 text-center border border-amber-700/60">
              <span className="text-[10px] font-bold text-amber-300 tracking-wider">
                COFFEE & TEA BAR
              </span>
            </div>

            {/* Tip Jar / Passive Income Jar */}
            <button
              onClick={onCollectIdleCoins}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 hover:bg-amber-500/30 transition-all cursor-pointer group active:scale-95"
              title="点击收取咖啡馆小费金币"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base group-hover:scale-125 transition-transform">🪙</span>
                <span className="text-[10px] font-bold text-amber-300">小费罐</span>
              </div>
              <span className="text-xs font-mono font-black text-amber-200 bg-amber-900/60 px-1.5 py-0.5 rounded-md">
                +{idleCoins}
              </span>
            </button>
          </div>

          {/* Cat 3 "奶盖" sitting by the counter if unlocked */}
          {hasSign && (
            <button
              onClick={e => triggerPetReaction(e, 'foam', 10, 200)}
              className="absolute -top-10 right-2 flex flex-col items-center group cursor-pointer"
              title="抚摸店长猫「奶盖」"
            >
              <span className="text-3xl transition-transform group-hover:scale-125 animate-bounce">
                😸
              </span>
              <span className="text-[9px] font-bold text-indigo-900 bg-white/90 px-1.5 py-0.2 rounded-full shadow-sm">
                奶盖
              </span>
            </button>
          )}
        </div>
      )}

      {/* 6. Potted Green Plants (Bottom Left or Beside Couch) */}
      {hasPlant && (
        <div className="absolute bottom-16 md:bottom-20 left-44 md:left-56 z-20 flex flex-col items-center pointer-events-none drop-shadow">
          <span className="text-3xl">🌿</span>
          <div className="w-7 h-8 bg-amber-800 rounded-b-xl border border-amber-700 shadow" />
        </div>
      )}

      {/* Dynamic Floating Hearts & Coin Pops when petting cats */}
      {petEffects.map(effect => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-50 text-sm font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-combo-pop"
          style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
        >
          {effect.text}
        </div>
      ))}

      {/* Top Banner Status Info */}
      <div className="relative z-30 p-4 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-sm pointer-events-auto">
          <Coffee className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-900">
            猫咪咖啡馆 · {unlockedItems.size}/10 设施已装潢
          </span>
        </div>

        {/* Floating Idle Coin Bubble if coins waiting */}
        {idleCoins > 0 && (
          <button
            onClick={onCollectIdleCoins}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/30 animate-bounce pointer-events-auto cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>收取小费 +{idleCoins}</span>
          </button>
        )}
      </div>

      {/* Bottom Hint Strip */}
      <div className="relative z-30 p-3 bg-gradient-to-t from-amber-950/20 to-transparent flex items-center justify-center text-xs text-amber-900/80 font-medium">
        <span>🐾 提示：点击咖啡馆里走动的猫咪可以互动获得金币爱心哦！</span>
      </div>
    </div>
  );
};
