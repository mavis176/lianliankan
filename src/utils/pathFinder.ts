import { Point, PathResult } from '../types/game';

/**
 * Checks if a straight horizontal or vertical line between p1 and p2 has all empty cells (excluding endpoints).
 */
export function isLineEmpty(grid: number[][], p1: Point, p2: Point): boolean {
  if (p1.r === p2.r) {
    const minC = Math.min(p1.c, p2.c);
    const maxC = Math.max(p1.c, p2.c);
    for (let c = minC + 1; c < maxC; c++) {
      if (grid[p1.r][c] !== 0) return false;
    }
    return true;
  }
  if (p1.c === p2.c) {
    const minR = Math.min(p1.r, p2.r);
    const maxR = Math.max(p1.r, p2.r);
    for (let r = minR + 1; r < maxR; r++) {
      if (grid[r][p1.c] !== 0) return false;
    }
    return true;
  }
  return false;
}

/**
 * 0-Turn Path: Straight line between p1 and p2
 */
export function check0Turn(grid: number[][], p1: Point, p2: Point): Point[] | null {
  if (p1.r === p2.r || p1.c === p2.c) {
    if (isLineEmpty(grid, p1, p2)) {
      return [p1, p2];
    }
  }
  return null;
}

/**
 * 1-Turn Path: Exactly one right-angle corner between p1 and p2
 */
export function check1Turn(grid: number[][], p1: Point, p2: Point): Point[] | null {
  // Candidate corner 1: (p1.r, p2.c)
  const c1: Point = { r: p1.r, c: p2.c };
  if (grid[c1.r][c1.c] === 0) {
    if (isLineEmpty(grid, p1, c1) && isLineEmpty(grid, c1, p2)) {
      return [p1, c1, p2];
    }
  }

  // Candidate corner 2: (p2.r, p1.c)
  const c2: Point = { r: p2.r, c: p1.c };
  if (grid[c2.r][c2.c] === 0) {
    if (isLineEmpty(grid, p1, c2) && isLineEmpty(grid, c2, p2)) {
      return [p1, c2, p2];
    }
  }

  return null;
}

/**
 * 2-Turn Path: Two corners (three straight segments)
 */
export function check2Turn(grid: number[][], p1: Point, p2: Point, totalRows: number, totalCols: number): Point[] | null {
  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 },  // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 },  // Right
  ];

  let bestPath: Point[] | null = null;
  let minDistance = Infinity;

  for (const { dr, dc } of directions) {
    let currR = p1.r + dr;
    let currC = p1.c + dc;

    // Travel along ray through empty cells (including 0 border coordinates)
    while (currR >= 0 && currR <= totalRows + 1 && currC >= 0 && currC <= totalCols + 1) {
      if (grid[currR][currC] !== 0) {
        // Blocked by tile or obstacle
        break;
      }

      const s1: Point = { r: currR, c: currC };
      // Test if s1 can connect to p2 via 1 turn
      const subPath = check1Turn(grid, s1, p2);
      if (subPath) {
        const fullPath = [p1, ...subPath];
        const dist = Math.abs(p1.r - s1.r) + Math.abs(p1.c - s1.c) +
                     Math.abs(s1.r - subPath[1].r) + Math.abs(s1.c - subPath[1].c) +
                     Math.abs(subPath[1].r - p2.r) + Math.abs(subPath[1].c - p2.c);
        if (dist < minDistance) {
          minDistance = dist;
          bestPath = fullPath;
        }
      }

      currR += dr;
      currC += dc;
    }
  }

  return bestPath;
}

/**
 * Determines whether two tiles can be connected under classic LianLianKan rules (turns <= 2)
 */
export function findPath(grid: number[][], p1: Point, p2: Point, totalRows: number, totalCols: number): PathResult {
  // Must not be the same cell
  if (p1.r === p2.r && p1.c === p2.c) {
    return { valid: false, turns: -1, path: [] };
  }

  // Both must be valid matched types (> 0) and identical
  const t1 = grid[p1.r][p1.c];
  const t2 = grid[p2.r][p2.c];
  if (t1 <= 0 || t2 <= 0 || t1 !== t2) {
    return { valid: false, turns: -1, path: [] };
  }

  // 1. Check 0-turn
  const path0 = check0Turn(grid, p1, p2);
  if (path0) {
    return { valid: true, turns: 0, path: path0 };
  }

  // 2. Check 1-turn
  const path1 = check1Turn(grid, p1, p2);
  if (path1) {
    return { valid: true, turns: 1, path: path1 };
  }

  // 3. Check 2-turn
  const path2 = check2Turn(grid, p1, p2, totalRows, totalCols);
  if (path2) {
    return { valid: true, turns: 2, path: path2 };
  }

  return { valid: false, turns: -1, path: [] };
}

/**
 * Finds any connectable pair currently on the board for the Hint system or deadlock checks.
 */
export function findAnyMatch(
  grid: number[][],
  rows: number,
  cols: number
): { p1: Point; p2: Point; path: Point[] } | null {
  // Collect all active tiles grouped by type
  const tilesByType = new Map<number, Point[]>();

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const type = grid[r][c];
      if (type > 0) {
        if (!tilesByType.has(type)) {
          tilesByType.set(type, []);
        }
        tilesByType.get(type)!.push({ r, c });
      }
    }
  }

  // Check each matching group
  for (const points of tilesByType.values()) {
    if (points.length < 2) continue;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const res = findPath(grid, points[i], points[j], rows, cols);
        if (res.valid) {
          return { p1: points[i], p2: points[j], path: res.path };
        }
      }
    }
  }

  return null;
}

/**
 * Generates obstacles in the grid
 */
export function getObstaclePositions(
  rows: number,
  cols: number,
  pattern: 'none' | 'corners' | 'centerCross' | 'pillars' | 'random4' | 'maze' = 'none'
): Point[] {
  const obstacles: Point[] = [];
  if (pattern === 'none') return obstacles;

  if (pattern === 'corners') {
    // 4 corners offset by 1
    obstacles.push({ r: 2, c: 2 });
    obstacles.push({ r: 2, c: cols - 1 });
    obstacles.push({ r: rows - 1, c: 2 });
    obstacles.push({ r: rows - 1, c: cols - 1 });
  } else if (pattern === 'centerCross') {
    const midR = Math.floor((rows + 1) / 2);
    const midC = Math.floor((cols + 1) / 2);
    obstacles.push({ r: midR, c: midC });
    obstacles.push({ r: midR + 1, c: midC });
    obstacles.push({ r: midR, c: midC + 1 });
    obstacles.push({ r: midR + 1, c: midC + 1 });
  } else if (pattern === 'pillars') {
    const r1 = Math.floor(rows / 3) + 1;
    const r2 = Math.floor((rows * 2) / 3);
    const c1 = Math.floor(cols / 3) + 1;
    const c2 = Math.floor((cols * 2) / 3);
    obstacles.push({ r: r1, c: c1 });
    obstacles.push({ r: r1, c: c2 });
    obstacles.push({ r: r2, c: c1 });
    obstacles.push({ r: r2, c: c2 });
  } else if (pattern === 'random4') {
    // Predefined symmetric artistic placement
    const halfR = Math.floor(rows / 2);
    const halfC = Math.floor(cols / 2);
    obstacles.push({ r: halfR - 1, c: 3 });
    obstacles.push({ r: halfR - 1, c: cols - 2 });
    obstacles.push({ r: halfR + 2, c: 3 });
    obstacles.push({ r: halfR + 2, c: cols - 2 });
  } else if (pattern === 'maze') {
    // Maze barrier blocks
    const midR = Math.floor((rows + 1) / 2);
    for (let c = 3; c <= cols - 2; c += 2) {
      obstacles.push({ r: midR - 1, c });
      obstacles.push({ r: midR + 1, c });
    }
  }

  return obstacles;
}

/**
 * Initializes a fully solvable board with even-paired tiles and verifies at least one initial match.
 */
export function createSolvableBoard(
  rows: number,
  cols: number,
  iconCount: number,
  obstaclePattern: 'none' | 'corners' | 'centerCross' | 'pillars' | 'random4' | 'maze' = 'none'
): { grid: number[][]; initialMatchCount: number } {
  const totalR = rows + 2;
  const totalC = cols + 2;

  const obstacleList = getObstaclePositions(rows, cols, obstaclePattern);
  const obstacleSet = new Set(obstacleList.map(p => `${p.r},${p.c}`));

  // Available cells inside playing boundary
  const playableCells: Point[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (!obstacleSet.has(`${r},${c}`)) {
        playableCells.push({ r, c });
      }
    }
  }

  // If playable count is odd, remove one obstacle or adjust to ensure even count for pairs
  if (playableCells.length % 2 !== 0) {
    if (obstacleList.length > 0) {
      const removed = obstacleList.pop()!;
      obstacleSet.delete(`${removed.r},${removed.c}`);
      playableCells.push(removed);
    } else {
      // Very rare case: add dummy obstacle at center
      const mid = playableCells.pop()!;
      obstacleSet.add(`${mid.r},${mid.c}`);
    }
  }

  const numPairs = playableCells.length / 2;

  // Distribute types evenly across pairs
  const tilePool: number[] = [];
  for (let p = 0; p < numPairs; p++) {
    const type = (p % iconCount) + 1;
    tilePool.push(type, type);
  }

  // Shuffle tile pool until a valid match exists
  let attempts = 0;
  while (attempts < 50) {
    attempts++;
    // Fisher-Yates shuffle
    for (let i = tilePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tilePool[i], tilePool[j]] = [tilePool[j], tilePool[i]];
    }

    // Build grid
    const grid: number[][] = Array.from({ length: totalR }, () => Array(totalC).fill(0));
    for (const obs of obstacleList) {
      grid[obs.r][obs.c] = -1; // -1 represents indestructible obstacle block
    }

    for (let i = 0; i < playableCells.length; i++) {
      const cell = playableCells[i];
      grid[cell.r][cell.c] = tilePool[i];
    }

    const match = findAnyMatch(grid, rows, cols);
    if (match) {
      return { grid, initialMatchCount: 1 };
    }
  }

  // If random attempts didn't immediately create a valid match, place at least one guaranteed pair adjacent
  const grid: number[][] = Array.from({ length: totalR }, () => Array(totalC).fill(0));
  for (const obs of obstacleList) {
    grid[obs.r][obs.c] = -1;
  }
  for (let i = 0; i < playableCells.length; i++) {
    const cell = playableCells[i];
    grid[cell.r][cell.c] = tilePool[i];
  }

  // Ensure first two cells have same type
  if (playableCells.length >= 2) {
    const p1 = playableCells[0];
    const p2 = playableCells[1];
    grid[p1.r][p1.c] = 1;
    grid[p2.r][p2.c] = 1;
  }

  return { grid, initialMatchCount: 1 };
}

/**
 * Reshuffles remaining active tiles on the board, ensuring at least one valid match.
 */
export function shuffleRemainingBoard(
  grid: number[][],
  rows: number,
  cols: number
): boolean {
  const activeCells: Point[] = [];
  const activeTypes: number[] = [];

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (grid[r][c] > 0) {
        activeCells.push({ r, c });
        activeTypes.push(grid[r][c]);
      }
    }
  }

  if (activeCells.length === 0) return false;

  for (let attempt = 0; attempt < 40; attempt++) {
    // Shuffle types
    for (let i = activeTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeTypes[i], activeTypes[j]] = [activeTypes[j], activeTypes[i]];
    }

    // Place back
    for (let i = 0; i < activeCells.length; i++) {
      const { r, c } = activeCells[i];
      grid[r][c] = activeTypes[i];
    }

    if (findAnyMatch(grid, rows, cols)) {
      return true;
    }
  }

  return true;
}
