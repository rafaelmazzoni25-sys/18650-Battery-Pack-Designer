import React from 'react';

interface BatteryPackVisualizerProps {
  seriesCount: number;
  parallelCount: number;
}

const BatteryCell: React.FC = () => (
    <div className="relative w-8 h-16 bg-slate-700 border-2 border-slate-500 rounded-lg shadow-inner shadow-black/50 flex flex-col items-center justify-between py-1">
        {/* Positive end */}
        <div className="flex flex-col items-center">
            <div className="w-4 h-1.5 bg-slate-500 rounded-t-sm border-b-2 border-slate-600"></div>
            <span className="text-sky-400 font-bold text-lg leading-none" aria-hidden="true">+</span>
        </div>

        {/* Negative end */}
        <span className="text-orange-400 font-bold text-2xl leading-none" aria-hidden="true">−</span>
    </div>
);

const BatteryPackVisualizer: React.FC<BatteryPackVisualizerProps> = ({
  seriesCount,
  parallelCount,
}) => {
  // Clamp values to prevent excessive rendering and browser freezing
  const sCount = Math.min(seriesCount, 20); // Max 20 series for visualization
  const pCount = Math.min(parallelCount, 15); // Max 15 parallel for visualization
  
  const tooManyCells = seriesCount > 20 || parallelCount > 15;

  // --- SVG Dimensions and Layout Constants ---
  const CELL_WIDTH = 32;
  const CELL_HEIGHT = 64;
  const CELL_GAP_X = 8;
  const CELL_GAP_Y = 32; // Increased gap for wiring
  const PADDING = 20;
  const BUS_BAR_OFFSET = 8;
  const BUS_BAR_HEIGHT = 6;
  const SERIES_CONNECTOR_WIDTH = 12; // Adjusted for better visual
  const TERMINAL_RADIUS = 12;
  const TERMINAL_OFFSET_Y = 40;
  const WIRING_STROKE_WIDTH = 4;

  const GRID_OFFSET_Y = PADDING + TERMINAL_OFFSET_Y;
  
  const totalWidth = pCount * CELL_WIDTH + (pCount - 1) * CELL_GAP_X;
  const totalHeight = sCount * CELL_HEIGHT + (sCount - 1) * CELL_GAP_Y;

  const svgWidth = totalWidth + PADDING * 2;
  const svgHeight = totalHeight + PADDING * 2 + TERMINAL_OFFSET_Y * 2;

  // --- Animation Constants ---
  const BASE_DELAY = 0.1; // seconds
  const ROW_DELAY_INCREMENT = 0.2;
  const CELL_DELAY_INCREMENT = 0.03;

  const cells = [];
  const parallelBusBars = [];
  const seriesConnectors = [];
  const mainTerminalsAndWiring = [];

  // --- Positive Terminal and Wiring ---
  const firstRowY = GRID_OFFSET_Y;
  const posBusBarY = firstRowY - BUS_BAR_OFFSET;
  const posTerminalX = PADDING + CELL_WIDTH / 2;
  const posTerminalY = GRID_OFFSET_Y - TERMINAL_OFFSET_Y;
  const posWireLength = Math.abs(posBusBarY - posTerminalY);

  mainTerminalsAndWiring.push(
    <React.Fragment key="positive-terminal-group">
      <line 
        x1={posTerminalX} y1={posBusBarY} x2={posTerminalX} y2={posTerminalY} 
        stroke="#38bdf8" strokeWidth={WIRING_STROKE_WIDTH} strokeLinecap="round" 
        style={{
          strokeDasharray: posWireLength,
          strokeDashoffset: posWireLength,
          animation: `draw-line 0.5s ease-out forwards`,
          animationDelay: `${BASE_DELAY}s`,
        }}
      />
      <g style={{ animation: `fade-in-pop 0.5s ease-out forwards`, animationDelay: `${BASE_DELAY + 0.3}s` }}>
        <circle cx={posTerminalX} cy={posTerminalY} r={TERMINAL_RADIUS} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <text x={posTerminalX} y={posTerminalY} fill="#38bdf8" fontSize="18" fontWeight="bold" textAnchor="middle" dy=".35em">+</text>
      </g>
    </React.Fragment>
  );

  // --- Generate Cell Grid and Connections ---
  for (let s = 0; s < sCount; s++) {
    const rowY = GRID_OFFSET_Y + s * (CELL_HEIGHT + CELL_GAP_Y);
    const busBarX1 = PADDING + CELL_WIDTH / 2;
    const busBarX2 = PADDING + totalWidth - CELL_WIDTH / 2;
    const currentRowDelay = BASE_DELAY + s * ROW_DELAY_INCREMENT;
    
    // Positive Bus Bar
    parallelBusBars.push(
      <rect key={`pos-bus-${s}`} x={busBarX1} y={rowY - BUS_BAR_OFFSET} width={busBarX2 - busBarX1} height={BUS_BAR_HEIGHT} fill="#38bdf8" rx="3" style={{
        transformOrigin: 'left center',
        animation: `grow-x 0.4s ease-out forwards`,
        animationDelay: `${currentRowDelay}s`
      }}/>
    );
    // Negative Bus Bar
    parallelBusBars.push(
      <rect key={`neg-bus-${s}`} x={busBarX1} y={rowY + CELL_HEIGHT + BUS_BAR_OFFSET - BUS_BAR_HEIGHT} width={busBarX2 - busBarX1} height={BUS_BAR_HEIGHT} fill="#fb923c" rx="3" style={{
        transformOrigin: 'left center',
        animation: `grow-x 0.4s ease-out forwards`,
        animationDelay: `${currentRowDelay}s`
      }}/>
    );

    for (let p = 0; p < pCount; p++) {
      const cellX = PADDING + p * (CELL_WIDTH + CELL_GAP_X);
      cells.push(
        <foreignObject key={`cell-${s}-${p}`} x={cellX} y={rowY} width={CELL_WIDTH} height={CELL_HEIGHT} style={{
          animation: `fade-in-pop 0.5s ease-out forwards`,
          animationDelay: `${currentRowDelay + p * CELL_DELAY_INCREMENT}s`
        }}>
          <BatteryCell />
        </foreignObject>
      );
    }

    if (s < sCount - 1) {
      const rectY = rowY + CELL_HEIGHT + BUS_BAR_OFFSET;
      const rectHeight = CELL_GAP_Y - (2 * BUS_BAR_OFFSET);
      let rectX;
      let transformOrigin;

      if (s % 2 === 0) { // Connection on the right
        rectX = busBarX2 - SERIES_CONNECTOR_WIDTH;
        transformOrigin = 'right center';
      } else { // Connection on the left
        rectX = busBarX1;
        transformOrigin = 'left center';
      }
      
      seriesConnectors.push(
        <rect
          key={`series-${s}`}
          x={rectX}
          y={rectY}
          width={SERIES_CONNECTOR_WIDTH}
          height={rectHeight}
          fill="url(#nickel-texture)"
          stroke="#475569"
          strokeWidth="1.5"
          rx="2"
          style={{
            transformOrigin: 'center top',
            animation: `grow-y 0.3s ease-out forwards`,
            animationDelay: `${currentRowDelay + ROW_DELAY_INCREMENT * 0.5}s`
          }}
        />
      );
    }
  }

  // --- Negative Terminal and Wiring ---
  const lastRowY = GRID_OFFSET_Y + (sCount - 1) * (CELL_HEIGHT + CELL_GAP_Y);
  const negBusBarY = lastRowY + CELL_HEIGHT + BUS_BAR_OFFSET - BUS_BAR_HEIGHT;
  const negTerminalY = lastRowY + CELL_HEIGHT + TERMINAL_OFFSET_Y + PADDING;
  const finalDelay = BASE_DELAY + sCount * ROW_DELAY_INCREMENT;

  let negTerminalX;
  if (sCount > 1 && (sCount - 1) % 2 !== 0) { // last series connection was left (e.g. 2S, 4S...), so exit is left
    negTerminalX = PADDING + CELL_WIDTH / 2;
  } else { // 1S pack, or last series connection was right (e.g. 3S, 5S...), so exit is right
    negTerminalX = PADDING + totalWidth - CELL_WIDTH / 2;
  }
  const negWireLength = Math.abs((negBusBarY + BUS_BAR_HEIGHT) - negTerminalY);


  mainTerminalsAndWiring.push(
    <React.Fragment key="negative-terminal-group">
      <line 
        x1={negTerminalX} y1={negBusBarY + BUS_BAR_HEIGHT} x2={negTerminalX} y2={negTerminalY} 
        stroke="#fb923c" strokeWidth={WIRING_STROKE_WIDTH} strokeLinecap="round" 
        style={{
          strokeDasharray: negWireLength,
          strokeDashoffset: negWireLength,
          animation: `draw-line 0.5s ease-out forwards`,
          animationDelay: `${finalDelay}s`,
        }}
      />
      <g style={{ animation: `fade-in-pop 0.5s ease-out forwards`, animationDelay: `${finalDelay + 0.3}s` }}>
        <circle cx={negTerminalX} cy={negTerminalY} r={TERMINAL_RADIUS} fill="#0f172a" stroke="#fb923c" strokeWidth="2" />
        <text x={negTerminalX} y={negTerminalY} fill="#fb923c" fontSize="22" fontWeight="bold" textAnchor="middle" dy=".35em">− </text>
      </g>
    </React.Fragment>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 overflow-auto">
      <h2 className="text-2xl font-bold text-slate-300 mb-4 text-center">Pack Visualization</h2>
      {tooManyCells && (
         <div className="text-center bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-lg mb-4 max-w-sm">
            <p className="font-bold">Visualization Limit Reached</p>
            <p className="text-sm">Displaying 20S x 15P max for performance.</p>
         </div>
      )}
      <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <svg key={`${sCount}-${pCount}`} width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
          <style>{`
            @keyframes draw-line {
              to { stroke-dashoffset: 0; }
            }
            @keyframes grow-x {
              from { transform: scaleX(0); }
              to { transform: scaleX(1); }
            }
            @keyframes grow-y {
              from { transform: scaleY(0); }
              to { transform: scaleY(1); }
            }
            @keyframes fade-in-pop {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
            /* Ensure transform origins are relative to the element itself */
            line, rect, g {
                transform-box: fill-box;
            }
          `}</style>
          <defs>
            <pattern id="nickel-texture" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="#cbd5e1" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1" />
            </pattern>
          </defs>
          {seriesConnectors}
          {mainTerminalsAndWiring}
          {parallelBusBars}
          {cells}
        </svg>
      </div>
    </div>
  );
};

export default BatteryPackVisualizer;