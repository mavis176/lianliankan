import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  Heart,
  Hammer,
  Coffee,
  Users,
  Coins,
  ChevronRight,
  Utensils,
  ListOrdered,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  JournalStage,
  DrinkMenuItem,
  CustomerEvent,
  CatPetStatus,
} from '../types/cafe';
import {
  JOURNAL_STAGES,
  DRINK_MENU_ITEMS,
  CUSTOMER_EVENTS,
} from '../data/cafeData';

interface CafeJournalViewProps {
  stars: number;
  coins: number;
  unlockedStages: Set<string>;
  unlockedDrinks: Set<string>;
  journalLogs: string[];
  catStatuses: Record<string, CatPetStatus>;
  idleCoinsPending: number;
  onCollectIdleCoins: () => void;
  currentLevelId: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUnlockStage: (stage: JournalStage) => void;
  onUnlockDrink: (drink: DrinkMenuItem) => void;
  onFeedCat: (catId: string) => void;
  onPetCat: (catId: string) => void;
  onStartLevel: () => void;
  onOpenLevelSelect?: () => void;
  onOpenExport?: () => void;
}

export const CafeJournalView: React.FC<CafeJournalViewProps> = ({
  stars,
  coins,
  unlockedStages,
  unlockedDrinks,
  journalLogs,
  catStatuses,
  idleCoinsPending,
  onCollectIdleCoins,
  currentLevelId,
  soundEnabled,
  onToggleSound,
  onUnlockStage,
  onUnlockDrink,
  onFeedCat,
  onPetCat,
  onStartLevel,
  onOpenLevelSelect,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'drinks' | 'cats_events'>('stages');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'early' | 'mid' | 'late'>('all');
  const logScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll log window to latest entry
  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [journalLogs]);

  const hasCustard = unlockedStages.has('stage_10_cat_custard') || unlockedStages.has('stage_3_cat_custard');
  const hasFlower = unlockedStages.has('stage_13_cat_flower') || unlockedStages.has('stage_7_cat_dango');
  const adoptedCatsCount = (hasCustard ? 1 : 0) + (hasFlower ? 1 : 0);

  // Calculate total passive bonus
  const totalBonusPercent = DRINK_MENU_ITEMS
    .filter(d => unlockedDrinks.has(d.id))
    .reduce((sum, d) => sum + d.bonusPercent, 0);

  const totalIdleRate = DRINK_MENU_ITEMS
    .filter(d => unlockedDrinks.has(d.id))
    .reduce((sum, d) => sum + d.idleIncomePerMin, 0);

  // Filtered stages
  const filteredStages = JOURNAL_STAGES.filter(s => {
    if (phaseFilter === 'all') return true;
    return s.phase === phaseFilter;
  });

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col justify-between bg-[#FAF7F2] text-[#2C2219] font-sans select-none overflow-hidden">
      
      {/* 1. TOP STATUS BAR (米纸白与暖木质感) */}
      <header className="w-full px-4 pt-3 pb-2.5 flex items-center justify-between shrink-0 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8DEC8] z-20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 星光灵感 */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#D9CDB8] px-2.5 py-1 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <span className="text-sm">⭐</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-[#8C6544] font-medium">星光灵感</span>
              <span className="text-xs font-bold text-[#2C2219] font-mono">{stars}</span>
            </div>
          </div>

          {/* 营业金币 */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#D9CDB8] px-2.5 py-1 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <span className="text-sm">🪙</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-[#8C6544] font-medium">营业金币</span>
              <span className="text-xs font-bold text-[#2C2219] font-mono">{coins.toLocaleString()}</span>
            </div>
          </div>

          {/* 驻店猫咪 */}
          <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#D9CDB8] px-2 py-1 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <span className="text-xs">🐾</span>
            <span className="text-xs font-bold text-[#5C4434] font-mono">{adoptedCatsCount} 只</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {onOpenLevelSelect && (
            <button
              onClick={onOpenLevelSelect}
              className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D9CDB8] flex items-center justify-center text-[#5C4434] hover:bg-[#F4ECE1] active:translate-y-0.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
              title="选关与无尽挑战"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D9CDB8] flex items-center justify-center text-[#5C4434] hover:bg-[#F4ECE1] active:translate-y-0.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
              title="导出单文件 HTML (Single-file HTML)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#D9CDB8] flex items-center justify-center text-[#5C4434] hover:bg-[#F4ECE1] active:translate-y-0.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
            title={soundEnabled ? '音效开启' : '静音'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC TEXT LOG WINDOW (营业随笔 / 猫咪日常) - Sticky upper panel */}
      <section className="px-3.5 pt-2.5 pb-1 shrink-0">
        <div className="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl shadow-[0_2px_8px_rgba(107,72,42,0.04)] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE7D8] mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📖</span>
              <h2 className="text-xs font-bold text-[#3B2C20] tracking-wide">
                猫咪咖啡馆随笔 · 营业日志
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#8C6544] font-medium bg-[#F5EFEB] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>温润营业中</span>
            </div>
          </div>

          {/* Scrollable Journal Logs Box */}
          <div
            ref={logScrollRef}
            className="h-28 sm:h-32 overflow-y-auto space-y-1.5 pr-1 text-[11px] text-[#4A3B2C] leading-relaxed scroll-smooth"
          >
            {journalLogs.map((log, index) => {
              const isHighlight = log.startsWith('【') || log.includes('正式入住') || log.includes('大获全胜');
              return (
                <div
                  key={index}
                  className={`p-1.5 rounded-xl transition-all ${
                    isHighlight
                      ? 'bg-[#FBF6EE] border-l-2 border-[#C49B71] text-[#332417]'
                      : 'bg-[#FAF8F5] text-[#554332]'
                  }`}
                >
                  <p className="whitespace-pre-line tracking-wide">{log}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SEGMENTED TABS: 🔨 空间施工 | ☕ 饮品研发 | 🐾 猫咪与日常 */}
      <div className="px-3.5 pt-1 pb-1 shrink-0">
        <div className="w-full bg-[#EFE8DA] p-1 rounded-2xl flex items-center justify-between gap-1 border border-[#E2D6C2]">
          <button
            onClick={() => setActiveTab('stages')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'stages'
                ? 'bg-[#FFFDF9] text-[#2C2219] shadow-sm'
                : 'text-[#7D6450] hover:text-[#2C2219]'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>空间施工 ({unlockedStages.size}/15)</span>
          </button>

          <button
            onClick={() => setActiveTab('drinks')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'drinks'
                ? 'bg-[#FFFDF9] text-[#2C2219] shadow-sm'
                : 'text-[#7D6450] hover:text-[#2C2219]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>饮品研发 ({unlockedDrinks.size}/6)</span>
          </button>

          <button
            onClick={() => setActiveTab('cats_events')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'cats_events'
                ? 'bg-[#FFFDF9] text-[#2C2219] shadow-sm'
                : 'text-[#7D6450] hover:text-[#2C2219]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>猫咪与日常</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN TABBED CONTENT AREA */}
      <main className="flex-1 w-full overflow-y-auto px-3.5 py-1.5 min-h-0">
        
        {/* ======================================================= */}
        {/* TAB 1: 【店铺施工与空间翻新】(15 个循序渐进的工程阶段)   */}
        {/* ======================================================= */}
        {activeTab === 'stages' && (
          <div className="space-y-2.5 pb-2">
            {/* Phase Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {(['all', 'early', 'mid', 'late'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPhaseFilter(p)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    phaseFilter === p
                      ? 'bg-[#6B482A] text-white shadow-xs'
                      : 'bg-[#EFE8DA] text-[#6B533E] hover:bg-[#E5DAC8]'
                  }`}
                >
                  {p === 'all' && '全部工程 (15)'}
                  {p === 'early' && '初期·毛坯翻修 (4)'}
                  {p === 'mid' && '中期·营业核心 (5)'}
                  {p === 'late' && '后期·猫咪乐园 (6)'}
                </button>
              ))}
            </div>

            {/* Stages Cards List */}
            <div className="space-y-2">
              {filteredStages.map((item, idx) => {
                const isUnlocked = unlockedStages.has(item.id);
                // Strict sequence check: must have previous stage unlocked
                const stageIndex = JOURNAL_STAGES.findIndex(s => s.id === item.id);
                const prevUnlocked = stageIndex === 0 || unlockedStages.has(JOURNAL_STAGES[stageIndex - 1].id);
                const canAfford = stars >= item.costStars && coins >= item.costCoins;
                const isAvailable = prevUnlocked && !isUnlocked;

                return (
                  <div
                    key={item.id}
                    className={`w-full p-2.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#F9F6F0] border-[#E8DEC8] opacity-90'
                        : isAvailable
                        ? 'bg-[#FFFDF9] border-[#D9CDB8] shadow-[0_2px_8px_rgba(107,72,42,0.05)] ring-1 ring-[#D9CDB8]/40'
                        : 'bg-[#F5F2EB]/60 border-[#E8DEC8]/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#F5EFEB] border border-[#E2D6C2] flex items-center justify-center text-base shrink-0 mt-0.5">
                          {item.icon}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-mono font-bold bg-[#EFE8DA] text-[#6B533E] px-1.5 py-0.2 rounded-md">
                              阶段 {item.stage}
                            </span>
                            <span className="text-[9px] text-[#A38265]">
                              {item.phaseTitle.split('·')[1]}
                            </span>
                            <h3 className="text-xs font-bold text-[#2C2219] truncate">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-[10px] text-[#78614E] mt-0.5 line-clamp-2 leading-tight">
                            {item.subtitle}
                          </p>

                          {!isUnlocked && (
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono font-bold text-[#8C6544]">
                              <span className="bg-[#FAF4EB] border border-[#E8DEC8] px-1.5 py-0.2 rounded-md">
                                ⭐ {item.costStars} 星
                              </span>
                              <span className="bg-[#FAF4EB] border border-[#E8DEC8] px-1.5 py-0.2 rounded-md">
                                🪙 {item.costCoins} 币
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center self-center">
                        {isUnlocked ? (
                          <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>已竣工</span>
                          </div>
                        ) : isAvailable ? (
                          <button
                            onClick={() => {
                              if (canAfford) onUnlockStage(item);
                            }}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-white shadow-amber-500/20 active:translate-y-0.5'
                                : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed opacity-80'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{canAfford ? '施工' : '缺少资源'}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-[9px] text-[#A38E7A] bg-[#EFEAE0] px-2 py-1 rounded-lg">
                            <Lock className="w-2.5 h-2.5" />
                            <span>待前置阶段</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: 【饮品研发与菜单升级】(永久提升通关金币与挂机收益) */}
        {/* ======================================================= */}
        {activeTab === 'drinks' && (
          <div className="space-y-3 pb-2">
            {/* Revenue Bonus Banner & Passive Coin Collector */}
            <div className="w-full bg-gradient-to-r from-[#FAF3E8] to-[#FFF9F0] border border-[#E5DAC8] rounded-2xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-sm">
                    ☕
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-bold text-[#3B2C20]">精品菜单总成效</span>
                    <span className="text-[10px] text-[#8C6544] mt-0.5">
                      通关金币加成 <strong className="text-amber-700">+{totalBonusPercent}%</strong> · 挂机产出 <strong>{totalIdleRate} 币/分</strong>
                    </span>
                  </div>
                </div>

                {/* Idle Coins Collection Button */}
                <button
                  onClick={onCollectIdleCoins}
                  disabled={idleCoinsPending <= 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    idleCoinsPending > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white active:scale-95 animate-pulse'
                      : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed opacity-60'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>收银台 (+{idleCoinsPending})</span>
                </button>
              </div>
            </div>

            {/* Drink Recipes Cards */}
            <div className="grid grid-cols-1 gap-2">
              {DRINK_MENU_ITEMS.map(drink => {
                const isUnlocked = unlockedDrinks.has(drink.id);
                const canAfford = coins >= drink.costCoins;

                return (
                  <div
                    key={drink.id}
                    className={`w-full p-2.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#FFFDF9] border-[#D9CDB8] shadow-xs'
                        : 'bg-[#F9F6F0]/80 border-[#E8DEC8] opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] border border-[#E2D6C2] flex items-center justify-center text-xl shrink-0">
                          {drink.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-[#2C2219]">{drink.name}</h3>
                            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                              +{drink.bonusPercent}% 收益
                            </span>
                          </div>
                          <p className="text-[10px] text-[#78614E] mt-0.5">{drink.subtitle}</p>
                          <p className="text-[9px] text-[#A38E7A] mt-0.5 line-clamp-1">{drink.desc}</p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center self-center">
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            已入驻菜单
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (canAfford) onUnlockDrink(drink);
                            }}
                            disabled={!canAfford}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-xs active:translate-y-0.5'
                                : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed opacity-80'
                            }`}
                          >
                            <span>研制</span>
                            <span className="font-mono text-[10px]">🪙{drink.costCoins}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 3: 【顾客与突发事件记录 + 猫咪状态】                 */}
        {/* ======================================================= */}
        {activeTab === 'cats_events' && (
          <div className="space-y-3 pb-2">
            {/* Cats Status & Care Cards */}
            <div className="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl p-3 shadow-xs">
              <span className="text-xs font-bold text-[#5C4434] flex items-center gap-1.5 mb-2">
                <span>🐾</span> 驻店猫咪状态与护理
              </span>

              {adoptedCatsCount === 0 ? (
                <div className="text-center py-4 text-xs text-[#8C7560]">
                  暂未领养猫咪，完成空间施工阶段 10 可迎接入驻橘猫「奶黄包」！
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hasCustard && catStatuses['custard'] && (
                    <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#E5DAC8] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">🐱</span>
                          <div>
                            <span className="text-xs font-bold text-[#3B2C20]">奶黄包</span>
                            <span className="text-[9px] text-[#8C6544] block">饱腹度: {catStatuses['custard'].satiety}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                          {catStatuses['custard'].moodText}
                        </span>
                      </div>

                      {/* Satiety Bar */}
                      <div className="w-full bg-[#E5DAC8] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${catStatuses['custard'].satiety}%` }}
                        />
                      </div>

                      {/* Cat Actions: Pet & Feed */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          onClick={() => onPetCat('custard')}
                          className="flex-1 py-1 rounded-lg bg-[#FFFDF9] border border-[#D9CDB8] text-[10px] font-bold text-[#5C4434] hover:bg-[#F3EADA] active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          <span>抚摸</span>
                        </button>
                        <button
                          onClick={() => onFeedCat('custard')}
                          className="flex-1 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-900 hover:bg-amber-200 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Utensils className="w-3 h-3 text-amber-700" />
                          <span>喂食 (-5🪙)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {hasFlower && catStatuses['flower'] && (
                    <div className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#E5DAC8] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">🐈</span>
                          <div>
                            <span className="text-xs font-bold text-[#3B2C20]">小碎花</span>
                            <span className="text-[9px] text-[#8C6544] block">饱腹度: {catStatuses['flower'].satiety}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full font-medium">
                          {catStatuses['flower'].moodText}
                        </span>
                      </div>

                      <div className="w-full bg-[#E5DAC8] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-pink-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${catStatuses['flower'].satiety}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          onClick={() => onPetCat('flower')}
                          className="flex-1 py-1 rounded-lg bg-[#FFFDF9] border border-[#D9CDB8] text-[10px] font-bold text-[#5C4434] hover:bg-[#F3EADA] active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          <span>抚摸</span>
                        </button>
                        <button
                          onClick={() => onFeedCat('flower')}
                          className="flex-1 py-1 rounded-lg bg-pink-100 border border-pink-300 text-[10px] font-bold text-pink-900 hover:bg-pink-200 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Utensils className="w-3 h-3 text-pink-700" />
                          <span>喂食 (-5🪙)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customer Stories & Event Cards Pool */}
            <div className="w-full space-y-2">
              <span className="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
                <span>☕</span> 咖啡馆生活切片与常客来信
              </span>

              <div className="space-y-2">
                {CUSTOMER_EVENTS.slice(0, Math.max(3, unlockedStages.size)).map(evt => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E2D6C2] shadow-xs flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#FAF4EB] border border-[#E2D6C2] flex items-center justify-center text-base shrink-0">
                      {evt.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#2C2219]">{evt.title}</h4>
                        <span className="text-[9px] font-mono font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                          +{evt.rewardCoins} 🪙 营业贡献
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8C6544] font-medium mt-0.5">来访者: {evt.character}</span>
                      <p className="text-[10px] text-[#554332] mt-0.5 leading-relaxed">{evt.story}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 5. BOTTOM ACTION BAR: START PROCUREMENT LEVEL BUTTON */}
      <footer className="w-full px-4 pt-2 pb-4 shrink-0 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-[#E8DEC8] z-20 flex items-center gap-2">
        <button
          onClick={onStartLevel}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#8C4309] hover:from-[#E68A17] hover:to-[#9A4B0B] text-white font-bold text-sm shadow-[0_4px_12px_rgba(180,83,9,0.22)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-base animate-bounce">🐾</span>
          <span className="tracking-wide">开始采购食材</span>
          <span className="bg-black/25 text-amber-100 text-xs font-mono font-medium px-2 py-0.5 rounded-full border border-white/20">
            第 {currentLevelId} 关
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
};
