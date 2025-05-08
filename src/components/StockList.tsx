import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStock } from '../context/StockContext';

const StockList: React.FC = () => {
  const { stocks, selectStock, selectedStock } = useStock();
  
  // Sort stocks by market cap (descending)
  const sortedStocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-white">Market Overview</h3>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {sortedStocks.slice(0, 6).map(stock => (
          <div 
            key={stock.symbol}
            className={`px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
              selectedStock?.symbol === stock.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onClick={() => selectStock(stock.symbol)}
          >
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stock.name}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-medium">${stock.price.toFixed(2)}</div>
              <div className={`flex items-center text-xs ${
                stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;