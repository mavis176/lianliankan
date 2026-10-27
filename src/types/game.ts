/**
 * Game Types and Interfaces
 */

export interface Point {
  r: number;
  c: number;
}

export interface TileData {
  id: string;
  r: number;
  c: number;
  type: number; // 1..N: tile symbol index, -1: obstacle block, 0: empty
  isObstacle?: boolean;
  isMatched?: boolean;
  isHinted?: boolean;
  isSelected?: boolean;
}

export interface PathResult {
  valid: boolean;
  turns: number;
  path: Point[];
}

export type ThemeType = 'fruits' | 'animals' | 'sweets' | 'gems' | 'space' | 'fantasy';

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  theme: ThemeType;
  rows: number;
  cols: number;
  iconCount: number;
  timeLimit: number; // in seconds
  obstacleType?: 'none' | 'corners' | 'centerCross' | 'pillars' | 'random4' | 'maze';
  targetScores: [number, number, number]; // 1, 2, 3 stars
  description: string;
}

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER' | 'LEVEL_SELECT';

export interface LevelProgress {
  levelId: number;
  stars: number;
  highScore: number;
  bestTime: number; // seconds remaining
  unlocked: boolean;
}

export interface ComboNotification {
  id: number;
  text: string;
  count: number;
  bonus: number;
  x: number;
  y: number;
}
