/**
 * Cat Cafe & LianLianKan Types
 */

export interface Point {
  r: number;
  c: number;
}

export interface RenovationItem {
  id: string;
  name: string;
  category: 'cleanup' | 'floor' | 'bar' | 'cattree' | 'cat' | 'furniture' | 'decor' | 'sign';
  costStars: number;
  costCoins: number;
  unlocked: boolean;
  title: string;
  desc: string;
  icon: string;
  requiredPrevId?: string;
}

export interface JournalStage {
  stage: number;
  id: string;
  name: string;
  subtitle: string;
  costStars: number;
  costCoins: number;
  narrativeLog: string;
  catId?: string;
  catName?: string;
  icon: string;
}

export interface CatData {
  id: string;
  name: string;
  breed: string;
  emoji: string;
  avatarColor: string;
  personality: string;
  favoriteSnack: string;
  unlocked: boolean;
  unlockItemId: string;
  soundPitch: number;
}

export interface CafeLevelConfig {
  id: number;
  title: string;
  subtitle: string;
  rows: number;
  cols: number;
  iconCount: number;
  timeLimit: number; // in seconds
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

export interface CafeState {
  coins: number;
  stars: number;
  unlockedItems: string[];
  adoptedCats: string[];
  idleCoins: number;
  lastCollectTime: number;
}
