/**
 * Cat Cafe & LianLianKan Expanded Types
 */

export interface Point {
  r: number;
  c: number;
}

export type ConstructionPhase = 'early' | 'mid' | 'late';

export interface JournalStage {
  stage: number;
  id: string;
  name: string;
  subtitle: string;
  phase: ConstructionPhase;
  phaseTitle: string;
  costStars: number;
  costCoins: number;
  narrativeLog: string;
  catId?: string;
  catName?: string;
  icon: string;
}

export interface DrinkMenuItem {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  icon: string;
  costCoins: number;
  bonusPercent: number; // e.g. +10% to +20% bonus coins from clears
  idleIncomePerMin: number; // Passive idle coins generated
}

export interface CustomerEvent {
  id: string;
  title: string;
  character: string;
  story: string;
  icon: string;
  rewardCoins: number;
  triggerMinStage: number;
}

export interface CatPetStatus {
  id: string;
  name: string;
  emoji: string;
  satiety: number; // 0-100 饱腹度
  moodText: string; // 心情状态
  favFood: string;
}

export interface CafeLevelConfig {
  id: number;
  title: string;
  subtitle: string;
  rows: number;
  cols: number;
  iconCount: number;
  mode: 'time' | 'moves';
  timeLimit: number; // in seconds (for time mode)
  movesLimit?: number; // for moves mode
  frozenCount?: number; // number of initial ice tiles 🧊
  obstacleType: 'none' | 'corners' | 'centerCross' | 'pillars' | 'random4' | 'maze';
  targetScores: [number, number, number]; // 1, 2, 3 stars
  rewardStars: number;
  rewardCoins: number;
  description: string;
}

export type CafeLevel = CafeLevelConfig;

export interface LevelProgress {
  levelId: number;
  stars: number;
  highScore: number;
  unlocked: boolean;
}
