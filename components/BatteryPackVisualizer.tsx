import React from 'react';

interface BatteryPackVisualizerProps {
  seriesCount: number;
  parallelCount: number;
}

const CELL_DIAMETER = 40; // in px
const BASE_CELL_GAP = 12; // Base gap, will be adjusted dynamically
const ROW_GAP = 32; // gap between rows for series connectors
const BUS_BAR_OFFSET = 6; // px distance from cell edge to bus bar
const SERIES_CONNECTOR_WIDTH = 10; // in px

const Cell: React.FC = () => (
  <div
    className="bg-slate-700 rounded-full border-2 border-slate-500 relative shadow-inner flex-shrink-0 flex flex-col justify-between items-center py-1"
    style={{ width: CELL_DIAMETER, height: CELL_DIAMETER }}
    aria-hidden="true"
  >
    {/* Positive Terminal Indicator */}
    <span className="font-bold text-sky-400 text-base leading-none select-none">+</span>
    {/* Negative Terminal Indicator */}
    <span className="font-bold text-orange-400 text-xl leading-none select-none">−</span>
  </div>
);


const BatteryPackVisualizer: React.FC<BatteryPackVisualizerProps> = ({ seriesCount, parallelCount }) => {
    // Clamp values to prevent excessive rendering
    const clampedSeries = Math.max(1, Math.min(seriesCount, 20));
    const clampedParallel = Math.max(1, Math.min(parallelCount, 20));

    // Dynamically adjust cell gap based on the number of parallel cells to manage width
    const dynamicCellGap = Math.max(4, BASE_CELL_GAP - Math.max(0, clampedParallel - 5));

    const packWidth = clampedParallel * CELL_DIAMETER + (clampedParallel > 1 ? (clampedParallel - 1) * dynamicCellGap : 0);
    const packHeight = clampedSeries * (CELL_DIAMETER + ROW_GAP) - ROW_GAP;

    // Add vertical padding for terminals to prevent clipping
    const verticalPadding = ROW_GAP * 2;
    const svgWidth = packWidth;
    const svgHeight = packHeight;

    return (
        <div className="w-full overflow-x-auto p-4 flex justify-center items-center" style={{ minHeight: packHeight + verticalPadding }}>
            <div className="relative" style={{ width: packWidth, height: packHeight, minWidth: packWidth }}>
                {/* Pack Terminals */}
                {/* Positive Terminal */}
                <div className="absolute flex flex-col items-center" style={{ 
                    left: (CELL_DIAMETER / 2) - (SERIES_CONNECTOR_WIDTH / 2), 
                    top: -(ROW_GAP / 2) - 10
                }}>
                    <div className="w-px h-4 bg-sky-400"></div>
                    <div className="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center text-slate-900 font-bold text-sm">+</div>
                    <span className="text-xs font-bold text-sky-400 mt-1">PACK</span>
                </div>

                {/* Negative Terminal */}
                <div className="absolute flex flex-col items-center" style={{ 
                     left: clampedSeries % 2 !== 0 
                           ? (CELL_DIAMETER / 2) - (SERIES_CONNECTOR_WIDTH / 2) 
                           : packWidth - (CELL_DIAMETER / 2) - (SERIES_CONNECTOR_WIDTH / 2),
                     bottom: -(ROW_GAP / 2) - 10
                }}>
                     <span className="text-xs font-bold text-orange-400 mb-1">PACK</span>
                    <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-slate-900 font-bold text-sm">-</div>
                    <div className="w-px h-4 bg-orange-400"></div>
                </div>
                
                {/* SVG Layer for Wiring */}
                <svg
                    width={svgWidth}
                    height={svgHeight}
                    className="absolute top-0 left-0"
                    style={{ overflow: 'visible' }}
                >
                    {Array.from({ length: clampedSeries }).map((_, s) => {
                        const rowY = s * (CELL_DIAMETER + ROW_GAP);
                        const firstCellX = CELL_DIAMETER / 2;
                        const lastCellX = packWidth - (CELL_DIAMETER / 2);

                        return (
                            <g key={`wiring-group-${s}`}>
                                {/* Parallel Connections (Bus Bars) */}
                                {clampedParallel > 1 && (
                                    <>
                                        {/* Positive Bus Bar */}
                                        <line x1={firstCellX} y1={rowY - BUS_BAR_OFFSET} x2={lastCellX} y2={rowY - BUS_BAR_OFFSET} className="stroke-sky-500" strokeWidth="2" strokeLinecap="round" />
                                        {/* Negative Bus Bar */}
                                        <line x1={firstCellX} y1={rowY + CELL_DIAMETER + BUS_BAR_OFFSET} x2={lastCellX} y2={rowY + CELL_DIAMETER + BUS_BAR_OFFSET} className="stroke-orange-500" strokeWidth="2" strokeLinecap="round" />
                                    </>
                                )}

                                {/* Individual Cell Connections to Bus Bars */}
                                {Array.from({ length: clampedParallel }).map((_, p) => {
                                    const cellX = p * (CELL_DIAMETER + dynamicCellGap) + (CELL_DIAMETER / 2);
                                    return (
                                        <React.Fragment key={`cell-wiring-${s}-${p}`}>
                                            {/* Positive Connection */}
                                            <line x1={cellX} y1={rowY} x2={cellX} y2={rowY - BUS_BAR_OFFSET} className="stroke-sky-500" strokeWidth="2" />
                                            {/* Negative Connection */}
                                            <line x1={cellX} y1={rowY + CELL_DIAMETER} x2={cellX} y2={rowY + CELL_DIAMETER + BUS_BAR_OFFSET} className="stroke-orange-500" strokeWidth="2" />
                                        </React.Fragment>
                                    );
                                })}

                                {/* Series Connectors */}
                                {s < clampedSeries - 1 && (
                                    <line
                                        x1={s % 2 === 0 ? lastCellX : firstCellX}
                                        y1={rowY + CELL_DIAMETER + BUS_BAR_OFFSET}
                                        x2={s % 2 === 0 ? lastCellX : firstCellX}
                                        y2={(s + 1) * (CELL_DIAMETER + ROW_GAP) - BUS_BAR_OFFSET}
                                        className="stroke-slate-400"
                                        strokeWidth={SERIES_CONNECTOR_WIDTH}
                                        strokeLinecap="round"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Cells Layer */}
                {Array.from({ length: clampedSeries }).map((_, s) => {
                    const rowY = s * (CELL_DIAMETER + ROW_GAP);
                    return (
                        <div key={`series-group-${s}`} className="absolute flex" style={{ top: rowY, left: 0, columnGap: `${dynamicCellGap}px` }}>
                            {Array.from({ length: clampedParallel }).map((_, p) => (
                                <Cell key={`cell-${s}-${p}`} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BatteryPackVisualizer;
