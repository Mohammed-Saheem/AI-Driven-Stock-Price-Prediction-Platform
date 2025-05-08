import React from 'react';
import { useStock } from '../context/StockContext';
import { TimeRange } from '../types/stock';

const TimeRangeSelector: React.FC = () => {
  const { timeRange, setTimeRange } = useStock();
  
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: '5y', label: '5Y' },
  ];

  return (
    <div className="inline-flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
      {timeRanges.map(({ value, label }) => (
        <button
          key={value}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === value 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          onClick={() => setTimeRange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;