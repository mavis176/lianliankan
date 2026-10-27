import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Point } from '../types/cafe';
import { ICON_COMPONENTS } from './HandDrawnIcons';
import { Box } from 'lucide-react';

interface LianLianKanBoardProps {
  rows: number;
  cols: number;
  grid: number[][];
  frozenMap?: boolean[][];
  selectedTile: Point | null;
  hintedPair: [Point, Point] | null;
  onTileClick: (r: number, c: number, rect: { x: number; y: number; width: number; height: number }) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const LianLianKanBoard: React.FC<LianLianKanBoardProps> = ({
  rows,
  cols,
  grid,
  frozenMap,
  selectedTile,
  hintedPair,
  onTileClick,
  containerRef,
}) => {
  const boardInnerRef = useRef<HTMLDivElement | null>(null);
  const [boardDimensions, setBoardDimensions] = useState<{ width: number; height: number; cellSize: number }>({
    width: 360,
    height: 360,
    cellSize: 45,
  });

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth - 16;
      const containerH = containerRef.current.clientHeight - 16;

      const totalColsWithPadding = cols + 2;
      const totalRowsWithPadding = rows + 2;

      const maxCellW = Math.floor(containerW / totalColsWithPadding);
      const maxCellH = Math.floor(containerH / totalRowsWithPadding);
      const cellSize = Math.max(34, Math.min(54, Math.min(maxCellW, maxCellH)));

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
    const list: { id: string; r: number; c: number; type: number; isObstacle: boolean; isFrozen: boolean; isSelected: boolean; isHinted: boolean }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const val = grid[r] ? grid[r][c] : 0;
        if (val !== 0) {
          const isSelected = selectedTile?.r === r && selectedTile?.c === c;
          const isHinted = hintedPair ? (
            (hintedPair[0].r === r && hintedPair[0].c === c) ||
            (hintedPair[1].r === r && hintedPair[1].c === c)
          ) : false;
          const isFrozen = frozenMap ? Boolean(frozenMap[r]?.[c]) : false;

          list.push({
            id: `tile-${r}-${c}`,
            r,
            c,
            type: val,
            isObstacle: val === -1,
            isFrozen,
            isSelected,
            isHinted,
          });
        }
      }
    }
    return list;
  }, [grid, rows, cols, selectedTile, hintedPair, frozenMap]);

  return (
    <div className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden select-none py-1">
      {/* Board Wooden Frame */}
      <div
        id="board-inner-frame"
        ref={boardInnerRef}
        className="relative rounded-3xl bg-[#7D5537] border-4 border-[#8C603C] shadow-[0_5px_0_#5C3D26] p-0.5 transition-all duration-300"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Subtle grid background slots for the dark wooden grid bed */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 rounded-2xl"
          style={{
            backgroundImage: `radial-gradient(circle, #EADCCB 1.2px, transparent 1.2px)`,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundPosition: `${cellSize / 2}px ${cellSize / 2}px`,
          }}
        />

        {/* Outer border track highlight */}
        <div
          className="absolute border border-dashed border-amber-300/25 rounded-2xl pointer-events-none"
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

          // Lookup SVG Component
          const IconComp = tile.isObstacle ? null : ICON_COMPONENTS[(tile.type - 1) % ICON_COMPONENTS.length];

          return (
            <button
              key={tile.id}
              id={`tile-${tile.r}-${tile.c}`}
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
                padding: '2.5px',
              }}
              className="group focus:outline-none rounded-2xl transition-transform active:scale-90"
            >
              {tile.isObstacle ? (
                // Wooden Crate Block
                <div className="w-full h-full rounded-2xl bg-[#A67C52] border-2 border-[#66462C] flex items-center justify-center shadow-[0_2px_0_#5C3D26] cursor-not-allowed">
                  <Box className="w-4 h-4 text-amber-100/70" />
                </div>
              ) : (
                // Playable Food Tile Card
                <div
                  className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
                    tile.isSelected
                      ? 'bg-[#FFFDF5] border-2 border-amber-400 ring-4 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-105 z-20 -translate-y-0.5'
                      : tile.isHinted
                      ? 'bg-[#FFF9EC] border-2 border-rose-400 ring-4 ring-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-tile-pulse z-10'
                      : tile.isFrozen
                      ? 'bg-sky-50/90 border-2 border-sky-400 ring-2 ring-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                      : 'bg-[#FFFDF8] hover:bg-[#FAF6EE] border-2 border-[#8C6541] shadow-[0_2px_0_#734F30] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Subtle glossy sheen */}
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-white/80 to-transparent rounded-t-2xl pointer-events-none" />

                  {/* Frozen Ice Overlay Badge */}
                  {tile.isFrozen && (
                    <div className="absolute inset-0 bg-sky-200/35 backdrop-blur-[0.5px] border border-cyan-300/60 rounded-2xl flex items-start justify-end p-0.5 pointer-events-none z-10">
                      <span className="text-[10px] leading-none drop-shadow-sm animate-pulse">🧊</span>
                    </div>
                  )}

                  {/* Hand-drawn SVG Icon */}
                  {IconComp && (
                    <div className={`flex items-center justify-center transition-transform group-hover:scale-105 ${tile.isFrozen ? 'opacity-85 filter contrast-110' : ''}`}>
                      <IconComp size={Math.max(22, cellSize * 0.62)} />
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
