import React from 'react';
import { BookmarkPlus, Bookmark, TrendingUp, TrendingDown } from 'lucide-react';
import { useStock } from '../context/StockContext';

const PortfolioSection: React.FC = () => {
  const { stocks, portfolio, addToPortfolio, removeFromPortfolio, selectStock, selectedStock } = useStock();
  
  // Filter stocks that are in the portfolio
  const portfolioStocks = stocks.filter(stock => portfolio.includes(stock.symbol));
  
  const handleTogglePortfolio = (event: React.MouseEvent, symbol: string) => {
    event.stopPropagation();
    if (portfolio.includes(symbol)) {
      removeFromPortfolio(symbol);
    } else {
      addToPortfolio(symbol);
    }
  };
  
  if (portfolioStocks.length === 0 && !selectedStock) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 flex justify-between items-center">
        <h3 className="font-medium text-slate-900 dark:text-white">My Portfolio</h3>
        
        {selectedStock && (
          <button
            onClick={(e) => handleTogglePortfolio(e, selectedStock.symbol)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
            title={portfolio.includes(selectedStock.symbol) ? "Remove from portfolio" : "Add to portfolio"}
          >
            {portfolio.includes(selectedStock.symbol) ? (
              <Bookmark className="h-5 w-5" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {portfolioStocks.length > 0 ? (
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {portfolioStocks.map(stock => (
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
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="font-medium text-right">${stock.price.toFixed(2)}</div>
                  <div className={`flex items-center justify-end text-xs ${
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
                <button
                  onClick={(e) => handleTogglePortfolio(e, stock.symbol)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          No stocks added to portfolio yet. Use the <BookmarkPlus className="h-4 w-4 inline" /> icon to add stocks.
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;