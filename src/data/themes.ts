import { ThemeType } from '../types/game';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  icons: string[];
  backgroundGradient: string;
  accentColor: string;
  glowColor: string;
  tileBg: string;
  tileBorder: string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  fruits: {
    id: 'fruits',
    name: '新鲜果园',
    icons: ['🍎', '🍓', '🍊', '🍋', '🍉', '🍇', '🍑', '🍒', '🍍', '🥝', '🥑', '🍌', '🫐', '🍈', '🥭', '🥥', '🍐', '🍏', '🍅', '🍒', '🍇', '🍉'],
    backgroundGradient: 'from-emerald-950/70 via-slate-900 to-teal-950/60',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    tileBg: 'bg-emerald-900/20 hover:bg-emerald-800/30 active:bg-emerald-800/40',
    tileBorder: 'border-emerald-500/20 hover:border-emerald-400/40',
  },
  animals: {
    id: 'animals',
    name: '萌宠森林',
    icons: ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🦉', '🐙', '🐬', '🐧', '🦔', '🐿️', '🐤', '🦋', '🐳'],
    backgroundGradient: 'from-amber-950/60 via-slate-900 to-orange-950/50',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    tileBg: 'bg-amber-900/20 hover:bg-amber-800/30 active:bg-amber-800/40',
    tileBorder: 'border-amber-500/20 hover:border-amber-400/40',
  },
  sweets: {
    id: 'sweets',
    name: '甜蜜工坊',
    icons: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮', '🍯', '🥐', '🥞', '🍿', '🧇', '🍡', '🥧', '☕', '🍓', '🍒'],
    backgroundGradient: 'from-pink-950/60 via-slate-900 to-rose-950/50',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    tileBg: 'bg-pink-900/20 hover:bg-pink-800/30 active:bg-pink-800/40',
    tileBorder: 'border-pink-500/20 hover:border-pink-400/40',
  },
  gems: {
    id: 'gems',
    name: '璀璨水晶',
    icons: ['💎', '🔮', '💍', '👑', '🧿', '💫', '🌟', '✨', '🪙', '🏆', '🎖️', '⚡', '❄️', '⚜️', '💠', '🪐', '🪞', '🪄', '💖', '🔷', '🔶', '❇️'],
    backgroundGradient: 'from-indigo-950/70 via-slate-900 to-violet-950/60',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    tileBg: 'bg-indigo-900/20 hover:bg-indigo-800/30 active:bg-indigo-800/40',
    tileBorder: 'border-indigo-500/20 hover:border-indigo-400/40',
  },
  space: {
    id: 'space',
    name: '星际深空',
    icons: ['🚀', '🛸', '🛰️', '👾', '🪐', '🌍', '🌕', '☄️', '🌌', '🔭', '👨‍🚀', '👽', '🤖', '⚡', '☀️', '🌠', '✨', '☄️', '🌑', '🌟', '🌀', '🛰️'],
    backgroundGradient: 'from-cyan-950/60 via-slate-900 to-blue-950/60',
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    tileBg: 'bg-cyan-900/20 hover:bg-cyan-800/30 active:bg-cyan-800/40',
    tileBorder: 'border-cyan-500/20 hover:border-cyan-400/40',
  },
  fantasy: {
    id: 'fantasy',
    name: '魔法秘境',
    icons: ['🧙', '🧝', '🧚', '🐉', '🦄', '⚔️', '🛡️', '🏹', '📜', '🔮', '🗝️', '🏰', '🧪', '🕯️', '🪙', '💎', '🏺', '🪄', '📜', '👑', '🔱', '🪞'],
    backgroundGradient: 'from-purple-950/70 via-slate-900 to-fuchsia-950/60',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    tileBg: 'bg-purple-900/20 hover:bg-purple-800/30 active:bg-purple-800/40',
    tileBorder: 'border-purple-500/20 hover:border-purple-400/40',
  },
};
