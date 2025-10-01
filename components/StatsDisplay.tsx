
import React from 'react';

interface StatsDisplayProps {
  seriesCount: number;
  parallelCount: number;
  totalCells: number;
  actualVoltage: number;
  actualCapacity: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  seriesCount,
  parallelCount,
  totalCells,
  actualVoltage,
  actualCapacity,
}) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-center mb-4 text-slate-300">Pack Specifications</h2>
      <div className="text-center mb-6">
        <p className="text-base text-slate-400">Configuration</p>
        <p className="text-5xl font-mono font-bold text-sky-400 tracking-tighter">
          {seriesCount}S{parallelCount}P
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
        <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-sm text-slate-400">Actual Voltage</p>
            <p className="text-2xl font-semibold text-sky-300">{actualVoltage.toFixed(1)} V</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-sm text-slate-400">Actual Capacity</p>
            <p className="text-2xl font-semibold text-orange-300">{actualCapacity.toFixed(1)} Ah</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-md col-span-1 sm:col-span-2">
            <p className="text-sm text-slate-400">Total Cells</p>
            <p className="text-2xl font-semibold text-slate-200">{totalCells}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
