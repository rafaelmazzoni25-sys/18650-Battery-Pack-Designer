
import React from 'react';

interface ControlsProps {
  voltage: number;
  setVoltage: (value: number) => void;
  capacity: number;
  setCapacity: (value: number) => void;
}

const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
);

const BatteryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
        <line x1="22" y1="12" x2="23" y2="12" strokeWidth="3"></line>
    </svg>
);


const Controls: React.FC<ControlsProps> = ({ voltage, setVoltage, capacity, setCapacity }) => {
  return (
    <div className="space-y-8 mb-8">
      <div>
        <label htmlFor="voltage" className="flex items-center text-lg font-medium text-slate-300 mb-2">
            <BoltIcon className="w-6 h-6 mr-2 text-sky-400" />
            Desired Voltage (V)
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="voltage"
            type="range"
            min="3.7"
            max="100"
            step="0.1"
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb-sky"
          />
          <input
            type="number"
            min="3.7"
            max="100"
            step="0.1"
            value={voltage.toFixed(1)}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            className="w-24 bg-slate-900/70 border border-slate-600 rounded-md text-center py-1.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="capacity" className="flex items-center text-lg font-medium text-slate-300 mb-2">
            <BatteryIcon className="w-6 h-6 mr-2 text-orange-400" />
            Desired Capacity (Ah)
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="capacity"
            type="range"
            min="3"
            max="100"
            step="0.5"
            value={capacity}
            onChange={(e) => setCapacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb-orange"
          />
          <input
            type="number"
            min="3"
            max="100"
            step="0.5"
            value={capacity.toFixed(1)}
            onChange={(e) => setCapacity(parseFloat(e.target.value))}
            className="w-24 bg-slate-900/70 border border-slate-600 rounded-md text-center py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      <style>{`
        .range-thumb-sky::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #38bdf8; /* sky-400 */
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #020617; /* slate-900 */
          transition: background .2s;
        }
        .range-thumb-sky::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #38bdf8;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #020617;
        }
        .range-thumb-orange::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #fb923c; /* orange-400 */
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #020617;
          transition: background .2s;
        }
        .range-thumb-orange::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #fb923c;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #020617;
        }
      `}</style>
    </div>
  );
};

export default Controls;
