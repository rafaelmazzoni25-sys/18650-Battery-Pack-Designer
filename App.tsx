import React, { useState, useMemo } from 'react';
import Controls from './components/Controls';
import StatsDisplay from './components/StatsDisplay';
import BatteryPackVisualizer from './components/BatteryPackVisualizer';
import { CELL_SPECS, CellSpec } from './constants';

const App: React.FC = () => {
  const [desiredVoltage, setDesiredVoltage] = useState<number>(48);
  const [desiredCapacity, setDesiredCapacity] = useState<number>(15);
  const [selectedCell, setSelectedCell] = useState<CellSpec>(CELL_SPECS[0]);

  const {
    seriesCount,
    parallelCount,
    totalCells,
    actualVoltage,
    actualCapacity,
  } = useMemo(() => {
    const sCount = Math.max(1, Math.round(desiredVoltage / selectedCell.voltage));
    const pCount = Math.max(1, Math.round(desiredCapacity / selectedCell.capacity));
    return {
      seriesCount: sCount,
      parallelCount: pCount,
      totalCells: sCount * pCount,
      actualVoltage: sCount * selectedCell.voltage,
      actualCapacity: pCount * selectedCell.capacity,
    };
  }, [desiredVoltage, desiredCapacity, selectedCell]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 tracking-tight">
            18650 Battery Pack Designer
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Visualize your custom battery configurations in real-time.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl shadow-slate-950/50">
            <Controls
              voltage={desiredVoltage}
              setVoltage={setDesiredVoltage}
              capacity={desiredCapacity}
              setCapacity={setDesiredCapacity}
              cellTypes={CELL_SPECS}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
            />
            <StatsDisplay
              seriesCount={seriesCount}
              parallelCount={parallelCount}
              totalCells={totalCells}
              actualVoltage={actualVoltage}
              actualCapacity={actualCapacity}
            />
          </div>

          <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl shadow-slate-950/50 flex flex-col justify-center items-center">
             <BatteryPackVisualizer
                seriesCount={seriesCount}
                parallelCount={parallelCount}
              />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Designed for educational and visualization purposes.</p>
            <p>Always consult with a professional for real-world battery pack construction.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
