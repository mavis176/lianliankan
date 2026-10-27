import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Point } from '../types/cafe';
import { CAFE_ICONS } from '../data/cafeData';
import { Box } from 'lucide-react';

interface GameBoardProps {
  rows: number;
  cols: number;
  grid: number[][];
  selectedTile: Point | null;
  hintedPair: [Point, Point] | null;
  onTileClick: (r: number, c: number, rect: { x: number; y: number; width: number; height: number }) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  rows,
  cols,
  grid,
  selectedTile,
  hintedPair,
  onTileClick,
  containerRef,
}) => {
  const boardInnerRef = useRef<HTMLDivElement | null>(null);
  const [boardDimensions, setBoardDimensions] = useState<{ width: number; height: number; cellSize: number }>({
    width: 600,
    height: 600,
    cellSize: 50,
  });

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth - 20;
      const containerH = containerRef.current.clientHeight - 20;

      const totalColsWithPadding = cols + 2;
      const totalRowsWithPadding = rows + 2;

      const maxCellW = Math.floor(containerW / totalColsWithPadding);
      const maxCellH = Math.floor(containerH / totalRowsWithPadding);
      const cellSize = Math.max(34, Math.min(64, Math.min(maxCellW, maxCellH)));

      setBoardDimensions({
        width: cellSize * totalColsWithPadding,
        height: cellSize * totalRowsWithPadding,
        cellSize,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rows, cols, containerRef]);

  const { cellSize, width, height } = boardDimensions;

  const tiles = useMemo(() => {
    const list: { id: string; r: number; c: number; type: number; isObstacle: boolean; isSelected: boolean; isHinted: boolean }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const val = grid[r] ? grid[r][c] : 0;
        if (val !== 0) {
          const isSelected = selectedTile?.r === r && selectedTile?.c === c;
          const isHinted = hintedPair ? (
            (hintedPair[0].r === r && hintedPair[0].c === c) ||
            (hintedPair[1].r === r && hintedPair[1].c === c)
          ) : false;

          list.push({
            id: `tile-${r}-${c}`,
            r,
            c,
            type: val,
            isObstacle: val === -1,
            isSelected,
            isHinted,
          });
        }
      }
    }
    return list;
  }, [grid, rows, cols, selectedTile, hintedPair]);

  return (
    <div className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden p-2 select-none">
      {/* Board Arena Outer Frame (Cozy Japanese Wooden Tray Style) */}
      <div
        ref={boardInnerRef}
        className="relative rounded-3xl bg-[#FAF6F0]/90 backdrop-blur-md border-2 border-[#E5DAC8] shadow-2xl shadow-amber-950/15 transition-all duration-300"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Subtle grid pattern for corridor guidance */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 rounded-3xl"
          style={{
            backgroundImage: `radial-gradient(circle, #D97706 1px, transparent 1px)`,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundPosition: `${cellSize / 2}px ${cellSize / 2}px`,
          }}
        />

        {/* Outer border track highlight */}
        <div
          className="absolute border border-dashed border-amber-500/25 rounded-2xl pointer-events-none"
          style={{
            left: `${cellSize * 0.5}px`,
            top: `${cellSize * 0.5}px`,
            width: `${(cols + 1) * cellSize}px`,
            height: `${(rows + 1) * cellSize}px`,
          }}
        />

        {/* Tiles */}
        {tiles.map(tile => {
          const left = tile.c * cellSize;
          const top = tile.r * cellSize;
          const icon = tile.isObstacle ? null : CAFE_ICONS[(tile.type - 1) % CAFE_ICONS.length];

          return (
            <button
              key={tile.id}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                onTileClick(tile.r, tile.c, {
                  x: rect.left,
                  y: rect.top,
                  width: rect.width,
                  height: rect.height,
                });
              }}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                padding: '3px',
              }}
              className="group focus:outline-none rounded-2xl transition-transform active:scale-90"
            >
              {tile.isObstacle ? (
                // Wooden Crate Obstacle
                <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#A67C52] to-[#8C6239] border border-[#734E29] flex items-center justify-center shadow-md shadow-amber-950/20 cursor-not-allowed">
                  <Box className="w-4 h-4 text-amber-100/70" />
                </div>
              ) : (
                // Playable Cafe Treat Tile
                <div
                  className={`relative w-full h-full rounded-2xl flex items-center justify-center font-bold transition-all duration-200 cursor-pointer overflow-hidden ${
                    tile.isSelected
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-white ring-4 ring-amber-400/50 scale-105 shadow-xl shadow-amber-500/30 z-20 -translate-y-1'
                      : tile.isHinted
                      ? 'bg-gradient-to-b from-pink-300 to-rose-400 border-2 border-white ring-4 ring-rose-400/50 animate-tile-pulse shadow-lg shadow-rose-500/30 z-10'
                      : 'bg-white hover:bg-amber-50/90 border border-amber-200/90 shadow-md shadow-amber-900/10 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Glossy top sheen */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-2xl pointer-events-none" />

                  {/* Icon */}
                  <span
                    className="select-none transition-transform group-hover:scale-110 drop-shadow-sm leading-none"
                    style={{
                      fontSize: `${Math.max(16, cellSize * 0.52)}px`,
                    }}
                  >
                    {icon}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
