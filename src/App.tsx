/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CafeJournalView } from './components/CafeJournalView';
import { PuzzleGameView } from './components/PuzzleGameView';
import { ParticleCanvasRef } from './components/ParticleCanvas';
import { LevelSelectModal } from './components/LevelSelectModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { ExportSingleFileModal } from './components/ExportSingleFileModal';
import {
  CAFE_LEVELS,
  JOURNAL_STAGES,
  INITIAL_JOURNAL_LOG,
  DRINK_MENU_ITEMS,
  generateEndlessLevel,
  CAT_INTERACTIONS,
} from './data/cafeData';
import { Point, LevelProgress, JournalStage, DrinkMenuItem, CatPetStatus, CafeLevelConfig } from './types/cafe';
import {
  createSolvableBoard,
  findPath,
  findAnyMatch,
  shuffleRemainingBoard,
} from './utils/pathFinder';
import { sound } from './utils/audio';

const STORAGE_KEY = 'purr_cafe_journal_v6_expanded';

export default function App() {
  const particleCanvasRef = useRef<ParticleCanvasRef | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const freezeTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Decoupled Views: 'CAFE' (3-Module Journal) vs 'PUZZLE' (Focused Mobile LianLianKan)
  const [currentView, setCurrentView] = useState<'CAFE' | 'PUZZLE'>('CAFE');

  // Currency & Progression
  const [stars, setStars] = useState<number>(4);
  const [coins, setCoins] = useState<number>(450);
  const [unlockedStages, setUnlockedStages] = useState<Set<string>>(
    new Set(['stage_1_cleanup', 'stage_2_floor'])
  );
  const [unlockedDrinks, setUnlockedDrinks] = useState<Set<string>>(
    new Set(['drink_pourover'])
  );
  const [journalLogs, setJournalLogs] = useState<string[]>([
    INITIAL_JOURNAL_LOG,
    JOURNAL_STAGES[0].narrativeLog,
    JOURNAL_STAGES[1].narrativeLog,
  ]);

  // Cats Status
  const [catStatuses, setCatStatuses] = useState<Record<string, CatPetStatus>>({
    custard: {
      id: 'custard',
      name: '奶黄包',
      emoji: '🐱',
      satiety: 85,
      moodText: '呼噜呼噜 💤',
      favFood: '深海三文鱼冻干',
    },
    flower: {
      id: 'flower',
      name: '小碎花',
      emoji: '🐈',
      satiety: 80,
      moodText: '伸懒腰踩奶 ✨',
      favFood: '鲜虾酥脆条',
    },
  });

  // Idle Revenue
  const [idleCoinsPending, setIdleCoinsPending] = useState<number>(15);

  // Levels & Progress (1~30 levels + endless mode)
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [endlessTier, setEndlessTier] = useState<number>(1);
  const [activeCustomLevel, setActiveCustomLevel] = useState<CafeLevelConfig | null>(null);

  const [progressList, setProgressList] = useState<LevelProgress[]>(() => {
    return CAFE_LEVELS.map(l => ({
      levelId: l.id,
      stars: l.id === 1 ? 2 : 0,
      highScore: l.id === 1 ? 1200 : 0,
      unlocked: l.id <= 2,
    }));
  });

  // Resolve current level config
  const currentLevel: CafeLevelConfig =
    activeCustomLevel ||
    CAFE_LEVELS.find(l => l.id === currentLevelId) ||
    CAFE_LEVELS[0];

  // Board State
  const [grid, setGrid] = useState<number[][]>([]);
  const [frozenMap, setFrozenMap] = useState<boolean[][]>([]);
  const [selectedTile, setSelectedTile] = useState<Point | null>(null);
  const [hintedPair, setHintedPair] = useState<[Point, Point] | null>(null);

  // Gameplay Metrics
  const [score, setScore] = useState<number>(0);
  const [baseScore, setBaseScore] = useState<number>(0);
  const [timeBonus, setTimeBonus] = useState<number>(0);
  const [comboBonus, setComboBonus] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [movesLeft, setMovesLeft] = useState<number>(30);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [clearedPairs, setClearedPairs] = useState<number>(0);
  const [totalInitialPairs, setTotalInitialPairs] = useState<number>(18);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);

  // Power-up counts
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [shufflesLeft, setShufflesLeft] = useState<number>(2);
  const [freezesLeft, setFreezesLeft] = useState<number>(1);

  // Modals & Sound
  const [gameState, setGameState] = useState<'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER'>('PLAYING');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [comboNotice, setComboNotice] = useState<{ id: number; text: string; count: number; bonus: number; x: number; y: number } | null>(null);

  // Load Saved Data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.stars === 'number') setStars(parsed.stars);
        if (typeof parsed.coins === 'number') setCoins(parsed.coins);
        if (Array.isArray(parsed.unlockedStages)) setUnlockedStages(new Set(parsed.unlockedStages));
        if (Array.isArray(parsed.unlockedDrinks)) setUnlockedDrinks(new Set(parsed.unlockedDrinks));
        if (Array.isArray(parsed.journalLogs) && parsed.journalLogs.length > 0) setJournalLogs(parsed.journalLogs);
        if (typeof parsed.currentLevelId === 'number') setCurrentLevelId(parsed.currentLevelId);
        if (typeof parsed.endlessTier === 'number') setEndlessTier(parsed.endlessTier);
        if (Array.isArray(parsed.progressList)) setProgressList(parsed.progressList);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveProgressToStorage = useCallback((
    newStars: number,
    newCoins: number,
    newStages: Set<string>,
    newDrinks: Set<string>,
    newLogs: string[],
    newProgList: LevelProgress[],
    nextLvl: number,
    eTier: number
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stars: newStars,
        coins: newCoins,
        unlockedStages: Array.from(newStages),
        unlockedDrinks: Array.from(newDrinks),
        journalLogs: newLogs,
        progressList: newProgList,
        currentLevelId: nextLvl,
        endlessTier: eTier,
      }));
    } catch {
      // ignore
    }
  }, []);

  // Idle Income Interval (runs in background)
  useEffect(() => {
    idleTimerRef.current = window.setInterval(() => {
      const idleRate = DRINK_MENU_ITEMS
        .filter(d => unlockedDrinks.has(d.id))
        .reduce((sum, d) => sum + d.idleIncomePerMin, 4);

      const added = Math.max(1, Math.round(idleRate / 6)); // every 10s
      setIdleCoinsPending(prev => Math.min(500, prev + added));
    }, 10000);

    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [unlockedDrinks]);

  // Initialize Level
  const initLevel = useCallback((lvlId: number, customLvl?: CafeLevelConfig) => {
    let lvl: CafeLevelConfig;
    if (customLvl) {
      lvl = customLvl;
      setActiveCustomLevel(customLvl);
      setCurrentLevelId(customLvl.id);
    } else if (lvlId > 100) {
      const tier = lvlId - 100;
      lvl = generateEndlessLevel(tier);
      setActiveCustomLevel(lvl);
      setCurrentLevelId(lvl.id);
    } else {
      lvl = CAFE_LEVELS.find(l => l.id === lvlId) || CAFE_LEVELS[0];
      setActiveCustomLevel(null);
      setCurrentLevelId(lvl.id);
    }

    setSelectedTile(null);
    setHintedPair(null);
    setScore(0);
    setBaseScore(0);
    setTimeBonus(0);
    setComboBonus(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(lvl.timeLimit);
    setMovesLeft(lvl.movesLimit || 35);
    setIsFrozen(false);
    setHintsLeft(3);
    setShufflesLeft(2);
    setFreezesLeft(1);
    setClearedPairs(0);
    setStarsEarned(0);
    setCoinsEarned(0);
    setGameState('PLAYING');

    const { grid: initialGrid, frozenMap: initialFrozen } = createSolvableBoard(
      lvl.rows,
      lvl.cols,
      lvl.iconCount,
      lvl.obstacleType,
      lvl.frozenCount || 0
    );

    let activeCount = 0;
    for (let r = 1; r <= lvl.rows; r++) {
      for (let c = 1; c <= lvl.cols; c++) {
        if (initialGrid[r][c] > 0) activeCount++;
      }
    }
    setTotalInitialPairs(Math.floor(activeCount / 2));
    setGrid(initialGrid);
    setFrozenMap(initialFrozen);
  }, []);

  // Mount setup
  useEffect(() => {
    initLevel(currentLevelId);
  }, [currentLevelId, initLevel]);

  // Timer Tick (only ticks in 'time' mode when playing in PUZZLE view)
  useEffect(() => {
    if (gameState !== 'PLAYING' || currentView !== 'PUZZLE' || currentLevel.mode !== 'time') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      if (!isFrozen) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            sound.playGameOver();
            setGameState('GAMEOVER');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isFrozen, currentView, currentLevel.mode]);

  // Collect Cash Register Idle Coins
  const handleCollectIdleCoins = () => {
    if (idleCoinsPending <= 0) return;
    sound.ensureContext();
    sound.playCoin();
    const nextCoins = coins + idleCoinsPending;
    setCoins(nextCoins);
    setIdleCoinsPending(0);
    saveProgressToStorage(stars, nextCoins, unlockedStages, unlockedDrinks, journalLogs, progressList, currentLevelId, endlessTier);
  };

  // Unlock Construction Stage
  const handleUnlockStage = (stage: JournalStage) => {
    sound.ensureContext();
    sound.playVictory();
    if (stage.catId) {
      setTimeout(() => sound.playMeow(650), 300);
    }

    const nextStars = stars - stage.costStars;
    const nextCoins = coins - stage.costCoins;
    const nextStages = new Set(unlockedStages);
    nextStages.add(stage.id);

    const nextLogs = [...journalLogs, stage.narrativeLog];
    setStars(nextStars);
    setCoins(nextCoins);
    setUnlockedStages(nextStages);
    setJournalLogs(nextLogs);

    saveProgressToStorage(nextStars, nextCoins, nextStages, unlockedDrinks, nextLogs, progressList, currentLevelId, endlessTier);
  };

  // Unlock Drink Recipe
  const handleUnlockDrink = (drink: DrinkMenuItem) => {
    sound.ensureContext();
    sound.playVictory();
    const nextCoins = coins - drink.costCoins;
    const nextDrinks = new Set(unlockedDrinks);
    nextDrinks.add(drink.id);

    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const logEntry = `【${timeStr} 研发】新饮品「${drink.name}」研制成功并上架！全店营业额永久提升 +${drink.bonusPercent}% ✨`;
    const nextLogs = [...journalLogs, logEntry];

    setCoins(nextCoins);
    setUnlockedDrinks(nextDrinks);
    setJournalLogs(nextLogs);

    saveProgressToStorage(stars, nextCoins, unlockedStages, nextDrinks, nextLogs, progressList, currentLevelId, endlessTier);
  };

  // Pet Cat Interaction
  const handlePetCat = (catId: string) => {
    sound.ensureContext();
    sound.playMeow(catId === 'custard' ? 620 : 780);
    sound.playPurr();
    sound.playCoin();

    const bonus = catId === 'custard' ? 4 : 5;
    const nextCoins = coins + bonus;
    setCoins(nextCoins);

    const quotes = CAT_INTERACTIONS[catId as keyof typeof CAT_INTERACTIONS] || [];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const logEntry = `【${timeStr} 互动】${randomQuote} (+${bonus} 🪙)`;
    const nextLogs = [...journalLogs, logEntry];
    setJournalLogs(nextLogs);

    saveProgressToStorage(stars, nextCoins, unlockedStages, unlockedDrinks, nextLogs, progressList, currentLevelId, endlessTier);
  };

  // Feed Cat Interaction
  const handleFeedCat = (catId: string) => {
    if (coins < 5) return;
    sound.ensureContext();
    sound.playCoin();
    sound.playPurr();

    const nextCoins = coins - 5;
    setCoins(nextCoins);

    setCatStatuses(prev => {
      const current = prev[catId];
      if (!current) return prev;
      return {
        ...prev,
        [catId]: {
          ...current,
          satiety: Math.min(100, current.satiety + 15),
          moodText: '满足地舔爪 💖',
        },
      };
    });

    const catName = catId === 'custard' ? '奶黄包' : '小碎花';
    const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const logEntry = `【${timeStr} 投喂】你为「${catName}」添了满满一碗进口主食肉泥，它吧唧吧唧吃得一干二净！(-5 🪙)`;
    const nextLogs = [...journalLogs, logEntry];
    setJournalLogs(nextLogs);

    saveProgressToStorage(stars, nextCoins, unlockedStages, unlockedDrinks, nextLogs, progressList, currentLevelId, endlessTier);
  };

  // Handle Tile Click with Exact Coordinate getBoundingClientRect Path Line & Ice Shatter
  const handleTileClick = (r: number, c: number, rect: { x: number; y: number; width: number; height: number }) => {
    sound.ensureContext();
    if (gameState !== 'PLAYING') return;

    const clickedType = grid[r][c];
    if (clickedType <= 0) return;

    if (!selectedTile) {
      sound.playSelect();
      setSelectedTile({ r, c });
      setHintedPair(null);
      return;
    }

    if (selectedTile.r === r && selectedTile.c === c) {
      sound.playDeselect();
      setSelectedTile(null);
      return;
    }

    // In moves limit mode, each match attempt consumes a move
    if (currentLevel.mode === 'moves') {
      const nextMoves = movesLeft - 1;
      setMovesLeft(nextMoves);
      if (nextMoves <= 0) {
        // Checked after elimination if failed
      }
    }

    // Check path connection (max 2 turns)
    const pathResult = findPath(grid, selectedTile, { r, c }, currentLevel.rows, currentLevel.cols);

    if (pathResult.valid) {
      // SUCCESSFUL CONNECTION!
      const p1 = selectedTile;
      const p2 = { r, c };

      if (boardContainerRef.current && particleCanvasRef.current) {
        const canvasEl = boardContainerRef.current.querySelector('canvas');
        if (canvasEl) {
          const canvasRect = canvasEl.getBoundingClientRect();
          const boardInnerEl = document.getElementById('board-inner-frame');
          const bRect = boardInnerEl ? boardInnerEl.getBoundingClientRect() : canvasRect;
          const cellW = bRect.width / (currentLevel.cols + 2);
          const cellH = bRect.height / (currentLevel.rows + 2);

          const canvasPoints = pathResult.path.map(pt => {
            const tileEl = document.getElementById(`tile-${pt.r}-${pt.c}`);
            if (tileEl) {
              const tRect = tileEl.getBoundingClientRect();
              return {
                x: tRect.left + tRect.width / 2 - canvasRect.left,
                y: tRect.top + tRect.height / 2 - canvasRect.top,
              };
            }
            return {
              x: bRect.left + (pt.c + 0.5) * cellW - canvasRect.left,
              y: bRect.top + (pt.r + 0.5) * cellH - canvasRect.top,
            };
          });

          particleCanvasRef.current.drawConnectingLine(canvasPoints, '#F59E0B');

          const startPt = canvasPoints[0];
          const endPt = canvasPoints[canvasPoints.length - 1];
          particleCanvasRef.current.burstParticles(startPt.x, startPt.y, '#F59E0B', 16);
          particleCanvasRef.current.burstParticles(endPt.x, endPt.y, '#F59E0B', 16);
        }
      }

      // Check if either tile is frozen 🧊
      const p1Frozen = frozenMap?.[p1.r]?.[p1.c] ?? false;
      const p2Frozen = frozenMap?.[p2.r]?.[p2.c] ?? false;

      let nextFrozen = frozenMap.map(row => [...row]);
      let nextGrid = grid.map(row => [...row]);

      if (p1Frozen || p2Frozen) {
        // Ice Shatter Mechanic!
        sound.playIceCrack();
        if (p1Frozen) nextFrozen[p1.r][p1.c] = false;
        if (p2Frozen) nextFrozen[p2.r][p2.c] = false;

        setFrozenMap(nextFrozen);
        setSelectedTile(null);
        setHintedPair(null);

        // Score bonus for ice crack
        setScore(s => s + 50);
        return;
      }

      // Neither is frozen -> standard elimination
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(prev => Math.max(prev, nextCombo));
      sound.playMatch(nextCombo);

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = window.setTimeout(() => {
        setCombo(0);
      }, 3500);

      // Score calculation
      const pairBase = 100;
      const cBonus = (nextCombo - 1) * 35;
      const earned = pairBase + cBonus;

      setBaseScore(b => b + pairBase);
      setComboBonus(cb => cb + cBonus);
      setScore(s => s + earned);

      // Combo pop
      if (nextCombo >= 2) {
        const comboText =
          nextCombo >= 5
            ? '喵不可言 (Fabulous!)'
            : nextCombo >= 4
            ? '大展喵手 (Great!)'
            : nextCombo >= 3
            ? '喵准消除 (Super!)'
            : '双喵齐下 (Nice!)';

        setComboNotice({
          id: Date.now(),
          text: comboText,
          count: nextCombo,
          bonus: cBonus,
          x: rect.x + rect.width / 2,
          y: rect.y,
        });

        setTimeout(() => setComboNotice(null), 1200);
      }

      nextGrid[p1.r][p1.c] = 0;
      nextGrid[p2.r][p2.c] = 0;
      setGrid(nextGrid);
      setSelectedTile(null);
      setHintedPair(null);

      const nextClearedPairs = clearedPairs + 1;
      setClearedPairs(nextClearedPairs);

      // Check remaining playable tiles
      let remainingTiles = 0;
      for (let ro = 1; ro <= currentLevel.rows; ro++) {
        for (let co = 1; co <= currentLevel.cols; co++) {
          if (nextGrid[ro][co] > 0) remainingTiles++;
        }
      }

      // LEVEL COMPLETE!
      if (remainingTiles === 0) {
        if (timerRef.current) clearInterval(timerRef.current);

        const tBonus = currentLevel.mode === 'time' ? timeLeft * 10 : (movesLeft - 1) * 20;
        const finalScore = score + earned + tBonus;
        setTimeBonus(tBonus);
        setScore(finalScore);

        let sEarned = 1;
        if (finalScore >= currentLevel.targetScores[2]) sEarned = 3;
        else if (finalScore >= currentLevel.targetScores[1]) sEarned = 2;
        setStarsEarned(sEarned);

        // Drinks bonus percentage
        const drinkBonus = DRINK_MENU_ITEMS
          .filter(d => unlockedDrinks.has(d.id))
          .reduce((sum, d) => sum + d.bonusPercent, 0);

        const baseRewardCoins = currentLevel.rewardCoins || (50 + sEarned * 25);
        const bonusCoins = Math.round(baseRewardCoins * (drinkBonus / 100));
        const cEarned = baseRewardCoins + bonusCoins;
        setCoinsEarned(cEarned);

        const newStars = stars + sEarned;
        const newCoins = coins + cEarned;
        setStars(newStars);
        setCoins(newCoins);

        let newTier = endlessTier;
        if (currentLevel.id > 100) {
          newTier = Math.max(endlessTier, currentLevel.id - 100 + 1);
          setEndlessTier(newTier);
        }

        const nextProg = progressList.map(p => {
          if (p.levelId === currentLevel.id) {
            return {
              ...p,
              stars: Math.max(p.stars, sEarned),
              highScore: Math.max(p.highScore, finalScore),
            };
          }
          if (p.levelId === currentLevel.id + 1) {
            return { ...p, unlocked: true };
          }
          return p;
        });
        setProgressList(nextProg);

        const nextLvlId = Math.min(30, currentLevel.id + 1);

        const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const victoryLog = `【${timeStr} 采购】${currentLevel.title} 采购大获全胜！带回了顶级原料，营业收益加成 +${drinkBonus}%！(+${sEarned} ⭐, +${cEarned} 🪙)`;
        const updatedLogs = [...journalLogs, victoryLog];
        setJournalLogs(updatedLogs);

        saveProgressToStorage(newStars, newCoins, unlockedStages, unlockedDrinks, updatedLogs, nextProg, nextLvlId, newTier);

        sound.playVictory();
        setGameState('VICTORY');
        return;
      }

      // Check if out of moves in moves mode
      if (currentLevel.mode === 'moves' && (movesLeft - 1) <= 0) {
        sound.playGameOver();
        setGameState('GAMEOVER');
        return;
      }

      // Auto-shuffle if deadlocked
      const nextMatch = findAnyMatch(nextGrid, currentLevel.rows, currentLevel.cols);
      if (!nextMatch) {
        setTimeout(() => {
          const shuffledGrid = nextGrid.map(row => [...row]);
          shuffleRemainingBoard(shuffledGrid, currentLevel.rows, currentLevel.cols);
          setGrid(shuffledGrid);
          sound.playShuffle();
        }, 300);
      }
    } else {
      // Not connectable
      if (grid[r][c] > 0) {
        sound.playSelect();
        setSelectedTile({ r, c });
      } else {
        sound.playDeselect();
        setSelectedTile(null);
      }

      if (currentLevel.mode === 'moves' && movesLeft <= 0) {
        sound.playGameOver();
        setGameState('GAMEOVER');
      }
    }
  };

  // Power-up 1: Hint
  const handleUseHint = () => {
    if (hintsLeft <= 0 || gameState !== 'PLAYING') return;
    sound.ensureContext();
    const match = findAnyMatch(grid, currentLevel.rows, currentLevel.cols);
    if (match) {
      sound.playHint();
      setHintsLeft(h => h - 1);
      setHintedPair([match.p1, match.p2]);
      setTimeout(() => setHintedPair(null), 3000);
    }
  };

  // Power-up 2: Shuffle
  const handleUseShuffle = () => {
    if (shufflesLeft <= 0 || gameState !== 'PLAYING') return;
    sound.ensureContext();
    sound.playShuffle();
    setShufflesLeft(s => s - 1);
    const shuffledGrid = grid.map(row => [...row]);
    shuffleRemainingBoard(shuffledGrid, currentLevel.rows, currentLevel.cols);
    setGrid(shuffledGrid);
    setSelectedTile(null);
    setHintedPair(null);
  };

  // Power-up 3: Freeze/Time
  const handleUseFreeze = () => {
    if (freezesLeft <= 0 || gameState !== 'PLAYING') return;
    sound.ensureContext();
    sound.playFreeze();
    setFreezesLeft(f => f - 1);
    setIsFrozen(true);
    if (currentLevel.mode === 'moves') {
      setMovesLeft(m => m + 5);
    } else {
      setTimeLeft(t => Math.min(currentLevel.timeLimit, t + 15));
    }

    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    freezeTimerRef.current = window.setTimeout(() => {
      setIsFrozen(false);
    }, 10000);
  };

  const progressPercent = totalInitialPairs > 0 ? (clearedPairs / totalInitialPairs) * 100 : 0;
  const remainingTilesCount = grid.reduce((acc, row) => acc + row.filter(cell => cell > 0).length, 0);

  // Switch to Puzzle Game
  const handleStartLevel = () => {
    sound.ensureContext();
    sound.playSelect();
    if (remainingTilesCount === 0 || gameState !== 'PLAYING') {
      initLevel(currentLevelId);
    }
    setCurrentView('PUZZLE');
  };

  // Return to Cafe Journal View
  const handleBackToCafe = () => {
    sound.ensureContext();
    sound.playSelect();
    setCurrentView('CAFE');
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#FAF7F2] flex flex-col items-center justify-center overflow-x-hidden font-sans select-none">
      <div className="w-full max-w-md h-full min-h-[100dvh] flex flex-col justify-between shadow-2xl relative bg-[#FAF7F2]">
        
        {/* VIEW 1: CAFE JOURNAL (3 Deep Modules: Stages, Drinks, Cats & Events) */}
        {currentView === 'CAFE' ? (
          <CafeJournalView
            stars={stars}
            coins={coins}
            unlockedStages={unlockedStages}
            unlockedDrinks={unlockedDrinks}
            journalLogs={journalLogs}
            catStatuses={catStatuses}
            idleCoinsPending={idleCoinsPending}
            onCollectIdleCoins={handleCollectIdleCoins}
            currentLevelId={currentLevelId}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              sound.soundEnabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            onUnlockStage={handleUnlockStage}
            onUnlockDrink={handleUnlockDrink}
            onFeedCat={handleFeedCat}
            onPetCat={handlePetCat}
            onStartLevel={handleStartLevel}
            onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        ) : (
          /* VIEW 2: DEDICATED MOBILE LIANLIANKAN PUZZLE VIEW (>70% board area, 30 Levels + Endless) */
          <PuzzleGameView
            level={currentLevel}
            grid={grid}
            frozenMap={frozenMap}
            selectedTile={selectedTile}
            hintedPair={hintedPair}
            onTileClick={handleTileClick}
            boardContainerRef={boardContainerRef}
            particleCanvasRef={particleCanvasRef}
            timeLeft={timeLeft}
            movesLeft={movesLeft}
            isFrozen={isFrozen}
            score={score}
            clearedPairs={clearedPairs}
            totalPairs={totalInitialPairs}
            progressPercent={progressPercent}
            hintsLeft={hintsLeft}
            shufflesLeft={shufflesLeft}
            freezesLeft={freezesLeft}
            onUseHint={handleUseHint}
            onUseShuffle={handleUseShuffle}
            onUseFreeze={handleUseFreeze}
            onBackToCafe={handleBackToCafe}
            onOpenPause={() => setGameState('PAUSED')}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              sound.soundEnabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            comboNotice={comboNotice}
          />
        )}
      </div>

      {/* MODALS */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        onSelectLevel={lvlId => {
          setIsLevelSelectOpen(false);
          initLevel(lvlId);
          setCurrentView('PUZZLE');
        }}
        progressList={progressList}
        currentLevelId={currentLevelId}
        endlessTier={endlessTier}
        onStartEndless={tier => {
          setIsLevelSelectOpen(false);
          const endlessLvl = generateEndlessLevel(tier);
          initLevel(endlessLvl.id, endlessLvl);
          setCurrentView('PUZZLE');
        }}
      />

      {/* Victory Modal with seamless return to cafe decoration or next level */}
      <VictoryModal
        isOpen={gameState === 'VICTORY'}
        level={currentLevel}
        score={score}
        baseScore={baseScore}
        timeBonus={timeBonus}
        comboBonus={comboBonus}
        starsEarned={starsEarned}
        coinsEarned={coinsEarned}
        hasNextLevel={currentLevel.id < 30 || currentLevel.id > 100}
        onNextLevel={() => {
          if (currentLevel.id > 100) {
            const nextTier = currentLevel.id - 100 + 1;
            const nextLvl = generateEndlessLevel(nextTier);
            initLevel(nextLvl.id, nextLvl);
          } else {
            initLevel(currentLevel.id + 1);
          }
          setCurrentView('PUZZLE');
        }}
        onReplay={() => {
          initLevel(currentLevel.id);
          setCurrentView('PUZZLE');
        }}
        onGoToCafe={() => {
          setGameState('PLAYING');
          setCurrentView('CAFE');
        }}
      />

      <GameOverModal
        isOpen={gameState === 'GAMEOVER'}
        level={currentLevel}
        score={score}
        remainingPairs={Math.ceil(remainingTilesCount / 2)}
        onReplay={() => initLevel(currentLevel.id)}
        onGoToCafe={() => {
          setGameState('PLAYING');
          setCurrentView('CAFE');
        }}
      />

      <PauseModal
        isOpen={gameState === 'PAUSED'}
        level={currentLevel}
        soundEnabled={soundEnabled}
        bgmEnabled={bgmEnabled}
        onResume={() => setGameState('PLAYING')}
        onReplay={() => initLevel(currentLevel.id)}
        onGoToCafe={() => {
          setGameState('PLAYING');
          setCurrentView('CAFE');
        }}
        onToggleSound={() => {
          sound.soundEnabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        onToggleBgm={() => {
          const next = sound.toggleBgm();
          setBgmEnabled(next);
        }}
      />

      <ExportSingleFileModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
