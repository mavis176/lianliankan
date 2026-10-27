import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX, Download, Sparkles, Heart } from 'lucide-react';
import { JournalStage, CatData } from '../types/cafe';
import { JOURNAL_STAGES, CAT_INTERACTIONS } from '../data/cafeData';
import { sound } from '../utils/audio';

interface CafeJournalViewProps {
  stars: number;
  coins: number;
  unlockedStages: Set<string>;
  journalLogs: string[];
  currentLevelId: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUnlockStage: (stage: JournalStage) => void;
  onAddLog: (entry: string) => void;
  onStartLevel: () => void;
  onOpenExport?: () => void;
  onPetCatBonus: (bonus: number) => void;
}

export const CafeJournalView: React.FC<CafeJournalViewProps> = ({
  stars,
  coins,
  unlockedStages,
  journalLogs,
  currentLevelId,
  soundEnabled,
  onToggleSound,
  onUnlockStage,
  onAddLog,
  onStartLevel,
  onOpenExport,
  onPetCatBonus,
}) => {
  const logScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll log window to bottom when new log entries arrive
  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [journalLogs]);

  // Determine adopted cats based on unlocked stages
  const hasCustard = unlockedStages.has('stage_3_cat_custard');
  const hasDango = unlockedStages.has('stage_7_cat_dango');
  const adoptedCatsCount = (hasCustard ? 1 : 0) + (hasDango ? 1 : 0);

  // Handle petting cat
  const handlePetCat = (catKey: 'custard' | 'dango', catName: string) => {
    sound.ensureContext();
    sound.playMeow(catKey === 'custard' ? 620 : 780);
    sound.playPurr();
    sound.playCoin();

    const bonus = catKey === 'custard' ? 3 : 4;
    onPetCatBonus(bonus);

    const quotes = CAT_INTERACTIONS[catKey] || [];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    onAddLog(`【${timeStr} 互动】${randomQuote} (+${bonus} 🪙)`);
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col justify-between bg-[#FAF7F2] text-[#2C2219] font-sans select-none overflow-hidden">
      
      {/* 1. TOP STATUS BAR (米纸白与暖木质感) */}
      <header className="w-full px-4 pt-3 pb-2.5 flex items-center justify-between shrink-0 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#E8DEC8] z-20">
        {/* Currencies */}
        <div className="flex items-center gap-2">
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

      {/* 2. MAIN SCROLLABLE CONTENT AREA */}
      <main className="flex-1 w-full overflow-y-auto px-3.5 py-3 space-y-3.5 min-h-0">
        
        {/* ==================================================== */}
        {/* A. DYNAMIC TEXT LOG WINDOW (营业随笔 / 猫咪日常) */}
        {/* ==================================================== */}
        <section className="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl shadow-[0_2px_8px_rgba(107,72,42,0.04)] p-3.5 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE7D8] mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">📖</span>
              <h2 className="text-xs sm:text-sm font-bold text-[#3B2C20] tracking-wide">
                猫咪咖啡馆随笔 · 营业日志
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-[#F5EFEB] text-[#8C6544] text-[10px] font-medium px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>温润经营中</span>
            </div>
          </div>

          {/* Scrollable Journal Logs Box */}
          <div
            ref={logScrollRef}
            className="h-36 sm:h-44 overflow-y-auto space-y-2 pr-1.5 text-xs text-[#4A3B2C] leading-relaxed font-sans scroll-smooth"
          >
            {journalLogs.map((log, index) => {
              const isHighlight = log.startsWith('【') || log.includes('正式入住') || log.includes('新铺');
              return (
                <div
                  key={index}
                  className={`p-2 rounded-xl transition-all ${
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
        </section>

        {/* ==================================================== */}
        {/* B. INTERACTIVE CATS ROW (Click to Pet & Purr)       */}
        {/* ==================================================== */}
        {adoptedCatsCount > 0 && (
          <section className="w-full bg-[#FFFDF9] border border-[#E2D6C2] rounded-2xl p-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
                <span>🐾</span> 驻店猫咪 (点击轻抚互动)
              </span>
              <span className="text-[10px] text-[#A38265]">抚摸可获得小惊喜</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {hasCustard && (
                <button
                  onClick={() => handlePetCat('custard', '奶黄包')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF4EB] hover:bg-[#F3EADA] border border-[#E5DAC8] text-left transition-all active:scale-95 cursor-pointer group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🐱</span>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xs font-bold text-[#3B2C20] truncate">奶黄包</span>
                    <span className="text-[10px] text-[#8C6544]">黏人橘猫 · 挠下巴</span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-rose-400 ml-auto fill-rose-400/30 group-hover:scale-125 transition-transform" />
                </button>
              )}

              {hasDango && (
                <button
                  onClick={() => handlePetCat('dango', '团子')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF4EB] hover:bg-[#F3EADA] border border-[#E5DAC8] text-left transition-all active:scale-95 cursor-pointer group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🐈</span>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xs font-bold text-[#3B2C20] truncate">团子</span>
                    <span className="text-[10px] text-[#8C6544]">傲娇三花 · 递冻干</span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-rose-400 ml-auto fill-rose-400/30 group-hover:scale-125 transition-transform" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* C. FACILITIES CONSTRUCTION CARDS (阶段建设卡片列表)   */}
        {/* ==================================================== */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-bold text-[#5C4434] flex items-center gap-1.5">
              <span>🔨</span> 咖啡馆设施建设计划
            </span>
            <span className="text-[11px] font-mono text-[#8C6544]">
              已竣工 {unlockedStages.size} / {JOURNAL_STAGES.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {JOURNAL_STAGES.map((item, idx) => {
              const isUnlocked = unlockedStages.has(item.id);
              const prevStageUnlocked = idx === 0 || unlockedStages.has(JOURNAL_STAGES[idx - 1].id);
              const canAfford = stars >= item.costStars && coins >= item.costCoins;
              const isAvailable = prevStageUnlocked && !isUnlocked;

              return (
                <div
                  key={item.id}
                  className={`w-full p-3 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-[#F9F6F0] border-[#E8DEC8] opacity-90'
                      : isAvailable
                      ? 'bg-[#FFFDF9] border-[#D9CDB8] shadow-[0_2px_8px_rgba(107,72,42,0.05)] ring-1 ring-[#D9CDB8]/40'
                      : 'bg-[#F5F2EB]/60 border-[#E8DEC8]/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] border border-[#E2D6C2] flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {item.icon}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold bg-[#EFE8DA] text-[#6B533E] px-1.5 py-0.2 rounded-md">
                            阶段 {item.stage}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-[#2C2219] truncate">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#78614E] mt-0.5 line-clamp-2 leading-tight">
                          {item.subtitle}
                        </p>

                        {/* Cost tags */}
                        {!isUnlocked && (
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono font-bold text-[#8C6544]">
                            <span className="flex items-center gap-0.5 bg-[#FAF4EB] border border-[#E8DEC8] px-1.5 py-0.5 rounded-md">
                              ⭐ {item.costStars} 星
                            </span>
                            <span className="flex items-center gap-0.5 bg-[#FAF4EB] border border-[#E8DEC8] px-1.5 py-0.5 rounded-md">
                              🪙 {item.costCoins} 币
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center self-center">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          <span>✓</span>
                          <span>已竣工</span>
                        </div>
                      ) : isAvailable ? (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onUnlockStage(item);
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/20 active:translate-y-0.5'
                              : 'bg-[#E8DEC8] text-[#8C7560] cursor-not-allowed opacity-80'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{canAfford ? '建设' : '缺少资源'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#A38E7A] bg-[#EFEAE0] px-2 py-1 rounded-lg">
                          待前置解锁
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 3. BOTTOM ACTION BAR: START LIANLIANKAN LEVEL BUTTON */}
      <footer className="w-full px-4 pt-2.5 pb-4 shrink-0 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-[#E8DEC8] z-20">
        <button
          onClick={onStartLevel}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#8C4309] hover:from-[#E68A17] hover:to-[#9A4B0B] text-white font-bold text-sm sm:text-base shadow-[0_4px_12px_rgba(180,83,9,0.25)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span className="text-lg animate-bounce">🐾</span>
          <span className="tracking-wide">开始采购食材</span>
          <span className="bg-black/25 text-amber-100 text-xs font-mono font-medium px-2 py-0.5 rounded-full border border-white/20">
            第 {currentLevelId} 关
          </span>
          <span className="text-xs">▶</span>
        </button>
      </footer>

    </div>
  );
};
