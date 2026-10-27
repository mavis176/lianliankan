import React from 'react';
import { X, Check, Lock, Sparkles, Star, Coins, Hammer } from 'lucide-react';
import { RENOVATION_ITEMS } from '../data/cafeData';
import { sound } from '../utils/audio';

interface RenovationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  coins: number;
  unlockedItems: Set<string>;
  onUnlockItem: (itemId: string, costStars: number, costCoins: number) => void;
}

export const RenovationModal: React.FC<RenovationModalProps> = ({
  isOpen,
  onClose,
  stars,
  coins,
  unlockedItems,
  onUnlockItem,
}) => {
  if (!isOpen) return null;

  const handleBuy = (item: typeof RENOVATION_ITEMS[0]) => {
    sound.ensureContext();
    if (stars < item.costStars || coins < item.costCoins) {
      sound.playInvalid();
      return;
    }
    sound.playRenovate();
    onUnlockItem(item.id, item.costStars, item.costCoins);
  };

  const progressPercent = Math.round((unlockedItems.size / RENOVATION_ITEMS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#FFFDF9] border border-amber-900/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-900/10 bg-amber-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-950 tracking-tight">咖啡馆装潢计划</h2>
              <p className="text-xs text-amber-800/70 mt-0.5">
                完成消除关卡获得猫爪星与金币，一步步打造温馨名店
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Player Currency Pill */}
            <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-sm text-xs font-bold">
              <span className="flex items-center gap-1 text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {stars}
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                {coins}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="px-6 py-3 bg-amber-100/40 border-b border-amber-900/5 flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-900">
            总装修进度: {unlockedItems.size} / {RENOVATION_ITEMS.length} ({progressPercent}%)
          </span>
          <div className="w-36 bg-amber-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Renovation Tasks List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {RENOVATION_ITEMS.map((item, index) => {
            const isUnlocked = unlockedItems.has(item.id);
            const prevMet = !item.requiredPrevId || unlockedItems.has(item.requiredPrevId);
            const canAfford = stars >= item.costStars && coins >= item.costCoins;
            const canUnlock = !isUnlocked && prevMet && canAfford;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-amber-50/40 border-amber-200/60'
                    : prevMet
                    ? 'bg-white border-amber-300 shadow-sm hover:border-amber-400'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-100/80 border border-emerald-300'
                        : 'bg-amber-100/70 border border-amber-200'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-600">
                        STEP {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-amber-950">{item.name}</h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>
                </div>

                {/* Right: Cost & Action Button */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <Check className="w-4 h-4" />
                      已装潢
                    </span>
                  ) : !prevMet ? (
                    <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                      <Lock className="w-3.5 h-3.5" />
                      前置未解锁
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/25 cursor-pointer'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          {item.costStars}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Coins className="w-3 h-3 text-amber-200" />
                          {item.costCoins}
                        </span>
                      </div>
                      <span className="border-l border-white/20 pl-2">装潢升级</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
