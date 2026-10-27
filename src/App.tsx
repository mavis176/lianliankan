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
import { CAFE_LEVELS, JOURNAL_STAGES, INITIAL_JOURNAL_LOG } from './data/cafeData';
import { Point, LevelProgress, JournalStage } from './types/cafe';
import {
  createSolvableBoard,
  findPath,
  findAnyMatch,
  shuffleRemainingBoard,
} from './utils/pathFinder';
import { sound } from './utils/audio';

const STORAGE_KEY = 'purr_cafe_journal_v5';

export default function App() {
  const particleCanvasRef = useRef<ParticleCanvasRef | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const freezeTimerRef = useRef<number | null>(null);

  // Decoupled Views: 'CAFE' (Pure-Text Narrative & Card Journal) vs 'PUZZLE' (Focused Mobile LianLianKan)
  const [currentView, setCurrentView] = useState<'CAFE' | 'PUZZLE'>('CAFE');

  // Currency & Journal Progression
  const [stars, setStars] = useState<number>(3);
  const [coins, setCoins] = useState<number>(350);
  const [unlockedStages, setUnlockedStages] = useState<Set<string>>(
    new Set(['stage_1_floor'])
  );
  const [journalLogs, setJournalLogs] = useState<string[]>([
    INITIAL_JOURNAL_LOG,
    JOURNAL_STAGES[0].narrativeLog,
  ]);

  // Levels & Progress
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [progressList, setProgressList] = useState<LevelProgress[]>(() => {
    return CAFE_LEVELS.map(l => ({
      levelId: l.id,
      stars: l.id === 1 ? 2 : 0,
      highScore: l.id === 1 ? 1200 : 0,
      unlocked: l.id <= 2,
    }));
  });

  const currentLevel = CAFE_LEVELS.find(l => l.id === currentLevelId) || CAFE_LEVELS[0];

  // Board State
  const [grid, setGrid] = useState<number[][]>([]);
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
        if (Array.isArray(parsed.journalLogs) && parsed.journalLogs.length > 0) setJournalLogs(parsed.journalLogs);
        if (typeof parsed.currentLevelId === 'number') setCurrentLevelId(parsed.currentLevelId);
        if (Array.isArray(parsed.progressList)) setProgressList(parsed.progressList);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveProgressToStorage = useCallback((
    newStars: number,
    newCoins: number,
    newUnlockedStages: Set<string>,
    newLogs: string[],
    newProgList: LevelProgress[],
    nextLvl: number
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stars: newStars,
        coins: newCoins,
        unlockedStages: Array.from(newUnlockedStages),
        journalLogs: newLogs,
        progressList: newProgList,
        currentLevelId: nextLvl,
      }));
    } catch {
      // ignore
    }
  }, []);

  // Initialize Level
  const initLevel = useCallback((lvlId: number) => {
    const lvl = CAFE_LEVELS.find(l => l.id === lvlId) || CAFE_LEVELS[0];
    setCurrentLevelId(lvl.id);
    setSelectedTile(null);
    setHintedPair(null);
    setScore(0);
    setBaseScore(0);
    setTimeBonus(0);
    setComboBonus(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(lvl.timeLimit);
    setIsFrozen(false);
    setHintsLeft(3);
    setShufflesLeft(2);
    setFreezesLeft(1);
    setClearedPairs(0);
    setStarsEarned(0);
    setCoinsEarned(0);
    setGameState('PLAYING');

    const { grid: initialGrid } = createSolvableBoard(
      lvl.rows,
      lvl.cols,
      lvl.iconCount,
      lvl.obstacleType
    );

    let activeCount = 0;
    for (let r = 1; r <= lvl.rows; r++) {
      for (let c = 1; c <= lvl.cols; c++) {
        if (initialGrid[r][c] > 0) activeCount++;
      }
    }
    setTotalInitialPairs(Math.floor(activeCount / 2));
    setGrid(initialGrid);
  }, []);

  // Mount setup
  useEffect(() => {
    initLevel(currentLevelId);
  }, [currentLevelId, initLevel]);

  // Timer Tick (only ticks when actively playing in PUZZLE view)
  useEffect(() => {
    if (gameState !== 'PLAYING' || currentView !== 'PUZZLE') {
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
  }, [gameState, isFrozen, currentView]);

  // Pet Cat Reward
  const handlePetCatBonus = (bonus: number) => {
    const nextCoins = coins + bonus;
    setCoins(nextCoins);
    saveProgressToStorage(stars, nextCoins, unlockedStages, journalLogs, progressList, currentLevelId);
  };

  // Add Log Entry
  const handleAddLog = (entry: string) => {
    const nextLogs = [...journalLogs, entry];
    setJournalLogs(nextLogs);
    saveProgressToStorage(stars, coins, unlockedStages, nextLogs, progressList, currentLevelId);
  };

  // Unlock Facility / Narrative Stage
  const handleUnlockStage = (stage: JournalStage) => {
    sound.ensureContext();
    sound.playVictory();
    if (stage.catId) {
      setTimeout(() => sound.playMeow(650), 300);
    }

    const nextStars = stars - stage.costStars;
    const nextCoins = coins - stage.costCoins;
    const nextUnlocked = new Set(unlockedStages);
    nextUnlocked.add(stage.id);

    const nextLogs = [...journalLogs, stage.narrativeLog];
    setStars(nextStars);
    setCoins(nextCoins);
    setUnlockedStages(nextUnlocked);
    setJournalLogs(nextLogs);

    saveProgressToStorage(nextStars, nextCoins, nextUnlocked, nextLogs, progressList, currentLevelId);
  };

  // Handle Tile Click with Exact Coordinate getBoundingClientRect Path Line
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

          // Calculate exact center coordinates via getBoundingClientRect for perfect alignment
          const canvasPoints = pathResult.path.map(pt => {
            const tileEl = document.getElementById(`tile-${pt.r}-${pt.c}`);
            if (tileEl) {
              const tRect = tileEl.getBoundingClientRect();
              return {
                x: tRect.left + tRect.width / 2 - canvasRect.left,
                y: tRect.top + tRect.height / 2 - canvasRect.top,
              };
            }
            // Corridor point or already cleared tile
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

      // Update Combo & Sound
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

      // Combo pop text
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

      // Eliminate tiles from grid
      const nextGrid = grid.map(row => [...row]);
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

        const tBonus = timeLeft * 10;
        const finalScore = score + earned + tBonus;
        setTimeBonus(tBonus);
        setScore(finalScore);

        // Calculate Stars Earned (1 to 3)
        let sEarned = 1;
        if (finalScore >= currentLevel.targetScores[2]) sEarned = 3;
        else if (finalScore >= currentLevel.targetScores[1]) sEarned = 2;
        setStarsEarned(sEarned);

        // Coins earned: 50 base + 20 per star + time/2
        const cEarned = 50 + sEarned * 20 + Math.floor(timeLeft / 2);
        setCoinsEarned(cEarned);

        const newStars = stars + sEarned;
        const newCoins = coins + cEarned;
        setStars(newStars);
        setCoins(newCoins);

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

        const nextLvlId = Math.min(CAFE_LEVELS.length, currentLevel.id + 1);

        // Append victory procurement log to journal!
        const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const victoryLog = `【${timeStr} 采购】第 ${currentLevel.id} 关食材采购大获全胜，带回了新鲜香浓原料！(+${sEarned} ⭐, +${cEarned} 🪙)`;
        const updatedLogs = [...journalLogs, victoryLog];
        setJournalLogs(updatedLogs);

        saveProgressToStorage(newStars, newCoins, unlockedStages, updatedLogs, nextProg, nextLvlId);

        sound.playVictory();
        setGameState('VICTORY');
        return;
      }

      // Auto-shuffle if board is deadlocked
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
      // Not connectable -> switch selection
      if (grid[r][c] > 0) {
        sound.playSelect();
        setSelectedTile({ r, c });
      } else {
        sound.playDeselect();
        setSelectedTile(null);
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
    setTimeLeft(t => Math.min(currentLevel.timeLimit, t + 15));

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
      {/* Central mobile-first viewport */}
      <div className="w-full max-w-md h-full min-h-[100dvh] flex flex-col justify-between shadow-2xl relative bg-[#FAF7F2]">
        
        {/* VIEW 1: CAFE JOURNAL (Pure-Text Narrative & Card Management) */}
        {currentView === 'CAFE' ? (
          <CafeJournalView
            stars={stars}
            coins={coins}
            unlockedStages={unlockedStages}
            journalLogs={journalLogs}
            currentLevelId={currentLevelId}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              sound.soundEnabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            onUnlockStage={handleUnlockStage}
            onAddLog={handleAddLog}
            onStartLevel={handleStartLevel}
            onOpenExport={() => setIsExportOpen(true)}
            onPetCatBonus={handlePetCatBonus}
          />
        ) : (
          /* VIEW 2: DEDICATED MOBILE LIANLIANKAN PUZZLE VIEW (>70% board area) */
          <PuzzleGameView
            level={currentLevel}
            grid={grid}
            selectedTile={selectedTile}
            hintedPair={hintedPair}
            onTileClick={handleTileClick}
            boardContainerRef={boardContainerRef}
            particleCanvasRef={particleCanvasRef}
            timeLeft={timeLeft}
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
        hasNextLevel={currentLevelId < CAFE_LEVELS.length}
        onNextLevel={() => {
          initLevel(currentLevelId + 1);
          setCurrentView('PUZZLE');
        }}
        onReplay={() => {
          initLevel(currentLevelId);
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
        onReplay={() => initLevel(currentLevelId)}
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
        onReplay={() => initLevel(currentLevelId)}
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
